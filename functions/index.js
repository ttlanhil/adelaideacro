const functions = require('firebase-functions');

const userSessions = require("./admin/user_sessions.js");



exports.listUsers = functions.https.onRequest((request, response) => {
    return userSessions.listUsers().then((users) => response.send(users));
});

exports.listSessions = functions.https.onRequest((request, response) => {
    return userSessions.listSessions().then((sessions) => response.send(sessions));
});


exports.getUserData = functions.https.onRequest((request, response) => {
    return userSessions.getUserData(request.query.user)
    .then((userData) => response.send(userData))
    .catch((err) => response.status(400).send(err));
});


function _param(request, name) {
    const val = request.query[name];
    if ("undefined" === typeof val) {
        return null;
    }
    const valLC = val.toLowerCase();
    if (valLC === "false") {
        return false;
    } else if (valLC === "true") {
        return true;
    }
    const asNum = +val;
    return asNum || val;
}


function _tryDo(response, func, ...args) {
    return func(...args)
    .then(() => response.sendStatus(200))
    .catch((err) => response.status(400).send(err));
}

exports.setModerator = functions.https.onRequest((request, response) => {
    return _tryDo(response, userSessions.setModerator, _param(request, "user"), _param(request, "value"));
});

exports.setParticipant = functions.https.onRequest((request, response) => {
    return _tryDo(response, userSessions.setParticipant, _param(request, "user"), _param(request, "value"));
});



exports.addSession = functions.https.onRequest((request, response) => {
    const argNames = ["displayName", "start", "end", "modOnly", "roomName"];
    const argVals = argNames.map(name => _param(request, name));

    return _tryDo(response, userSessions.addSession, ...argVals);
});


exports.updateSession = functions.https.onRequest((request, response) => {
    const session = _param(request, "sessionID");
    if (!session) {
        return response.status(400).send("sessionID not specified");
    }
    let args = {};
    ["displayName", "start", "end", "modOnly", "roomName"].forEach((argName) => {
        const argVal = _param(request, argName);
        if (argVal !== null) {
            args[argName] = argVal;
        }
    });

    return _tryDo(response, userSessions.updateSession, session, args);
});


exports.deleteSession = functions.https.onRequest((request, response) => {
    const session = _param(request, "sessionID");
    if (!session) {
        return response.status(400).send("sessionID not specified");
    }

    return _tryDo(response, userSessions.deleteSession, session);
});
