const fs = require('fs');
const settings = require("./private/settings.js");
const jwt = require("jsonwebtoken");
const jwtKey = fs.readFileSync(settings.jwtKeyFile);



/*
    "user": {
      "id": "0f8b7760-c17f-4a12-b134-c6ac37167144",
      "name": "John Doe",
      "avatar": "https://link.to/user/avatar/picture",
      "email": "john.doe@company.com",
      "moderator": "true"
    },
*/


function create(session, user) {
    const isMod = (user.moderator === "true" || user.moderator === true);
    // unless moderator, won't be able to join after scheduled end time

    const header = {
        alg: "RS256",
        kid: settings.key_id,
        typ: "JWT"
    };

    const claim = {
        aud: "jitsi",
        context: {
            user: user,
            features: {
                livestreaming: "false",
                recording: "false",
                moderation: user.moderator
            }
        },
        sub: settings.tenant_id,
        iss: "chat",
//         room: isMod ? "*" : settings.tenant_id + "/" + session.roomName,
        room: "*",
        // if not moderator, then include expiry times. spread operator to unpack the result of the conditional
        ...(isMod || {
            exp: session.end,
            nbf: session.nbf,
        }),
    };

    return jwt.sign(claim, jwtKey, { algorithm: 'RS256', header: header});
}

module.exports = {
    create,
};
