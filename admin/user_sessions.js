const admin = require("./firebase.js");
const token = require("./token.js");

const settings = require("./private/settings.js");

const db = admin.database();

const defaultSessionDuration = 1 * 60 * 60;  // 1hr or 60min

const currentTimestamp = Date.now()/1000;
const ONE_DAY = 24*60*60;

const sessionJoinStartBuffer = 15*60;  // can join up to 15m early. ignored by mods.

function userCanJoinSession(user, session) {
    if (user.moderator) {
        // mods can join all sessions
        return true;
    }
    if (session.modOnly) {
        // not a mod, but session is only for mods
        return false;
    }
    if (user.participant) {
        // user allowed to join in
        return true;
    }
    return false;
}


function updateBySession(sessionID, sessionData) {
    // for the given session
    // iterate all users
    // if appropriate, add/update session token for that user

    const doUpdates = () => iterateUsers( (userRecord) => {
        let sessionToken = null;
        if (userCanJoinSession(userRecord, sessionData)) {
            sessionToken = token.create(sessionData, userRecord);
        }
        setSessionToken(userRecord.uid, sessionID, sessionToken);
    });

    if (sessionID && !sessionData) {
        // if no sessionData, need to fetch from DB first
        db.ref("sessions/"+sessionID).once("value", (sessionDataRef) => {
            sessionData = sessionDataRef.val();
            doUpdates();
        });
    } else {
        doUpdates();
    }
}





function updateByUser(userIDs) {
    // for the given user(s), look at all upcoming sessions
    // replace all tokens for user (called when participant/moderator flag changed, so new tokens needed)
    // any session they no longer qualify for will lose the token

    // allow single uid to be passed in as string
    if (typeof userIDs === "string") {
        userIDs = [userIDs];
    }

    userIDs.forEach((uid) => {
        getUserData(uid).then((user) => {
            const callback = (sessionID, sessionData) => {
                let sessionToken = null;
                if (userCanJoinSession(user, sessionData)) {
                    sessionToken = token.create(sessionData, user);
                }
                setSessionToken(uid, sessionID, sessionToken);
            };
            iterateSessions(callback);
        });
    });
}









function setUserFlag(uids, key, value) {
    // allow single uid to be passed in as string
    if (typeof uids === "string") {
        uids = [uids];
    }
    value = value ? "true" : null;
    let updates = {};
    uids.forEach((uid) => {
        updates[uid + "/" + key] = value;
    });
    return db.ref("users").update(updates).then(
        () => updateByUser(uids)
    );
}

function setModerator(uids, value=true) {
    return setUserFlag(uids, "moderator", value);
}

function setParticipant(uids, value = true) {
    return setUserFlag(uids, "participant", value);
}



function _mergeUserWithUserData(userRecord) {
    let mergedData = {
        uid: userRecord.uid,
        name: userRecord.displayName,
        email: userRecord.email,
        lastLogin: userRecord.metadata.lastRefreshTime || userRecord.metadata.lastSignInTime,
        emailVerified: userRecord.emailVerified,
    };
    if (userRecord.providerData) {
        mergedData.loginMethod = userRecord.providerData.map((a) => a.providerId).join(", ");
    }
    return db.ref("users/"+userRecord.uid).once("value", (userDataRef) => {
        const userData = userDataRef.val();
        if (userData) {
            if (userData.moderator) {
                mergedData.moderator = userData.moderator;
            }
            if (userData.participant) {
                mergedData.participant = userData.participant;
            }
        }
    }).then(() => {
        return mergedData;
    });
}

function getUserData(uid) {
    return admin
    .auth()
    .getUser(uid)
    .then((userRecord) => {
        return _mergeUserWithUserData(userRecord);
    });
}


const iterateUsers = (callback, nextPageToken) => {
    // List batch of users
    admin
    .auth()
    .listUsers(100, nextPageToken)
    .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
            if (userRecord.disabled) {
                return;
            }
            _mergeUserWithUserData(userRecord).then(callback);
        });
        if (listUsersResult.pageToken) {
            // List next batch of users.
            iterateUsers(callback, listUsersResult.pageToken);
        }
    });
};

// TODO: add sorting/filter to only show new users with a displayname or whatever
async function listUsers() {
    let users = await admin.auth().listUsers();
    users = users.users.filter(userRecord => ! userRecord.disabled);
    users = users.map(userRecord => _mergeUserWithUserData(userRecord));
    return Promise.all(users);
}




function setSessionToken(uid, sessionID, token) {
    const key = "users/"+uid+"/sessionTokens";
    const data = {};
    data[sessionID] = token;

    db.ref(key).update(data);
}




function addSession(displayName, start, end, modOnly=false, roomName=settings.defaultRoom) {
    // start should be a UNIX timestamp, in seconds (not JS millis)

    const nbf = start - sessionJoinStartBuffer;    // NotBeFore

    // if end is specified, use it, otherwise calculate end time based on start and default duration
    end = end || start + defaultSessionDuration;

    const details = { displayName, start, end, nbf, roomName, modOnly };
    // generate new ID using push, key for new entry is return value

    const sessRef = db.ref("sessions").push();
    return sessRef.set(details).then( () => updateBySession(sessRef.key, details) );
}


function updateSession(sessionID, newDetails) {
    // only apply changes in newDetails, existing details remain as they are

    if (newDetails.start && ! newDetails.nbf) {
        newDetails.nbf = newDetails.start - sessionJoinStartBuffer
    }

    return db.ref("sessions/" + sessionID).update(newDetails).then(()=> {
        // if anything other than name changed, update all user session entries
        delete newDetails["displayName"];
        if (Object.keys(newDetails).length > 0){
            updateBySession(sessionID);
        }
    });
}


function iterateSessions(callback, includePast=false) {
    let dbRef = db.ref("sessions");

    if (!includePast) {
        dbRef = dbRef.orderByChild("end").startAt(currentTimestamp);
    }

    dbRef.once("value", (sessionDataRef) => {
        const sessionData = sessionDataRef.val();
        for (let sessionID in sessionData) {
            callback(sessionID, sessionData[sessionID]);
        }
    });

}


async function listSessions(includePast=false) {
    let dbRef = db.ref("sessions");

    if (!includePast) {
        dbRef = dbRef.orderByChild("end").startAt(currentTimestamp);
    }

    let sessions = await dbRef.once("value");

    return sessions.val();
}



module.exports = {
    setModerator,
    setParticipant,
    listUsers,
    getUserData,

    addSession,
    updateSession,
    listSessions,
}
