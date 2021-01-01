const admin = require("firebase-admin");

const serviceAccount = require("./private/website-48ee6-firebase-adminsdk-u4efa-7c7f26708a.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://website-48ee6.firebaseio.com"
});

module.exports = admin;
