const userSessions = require("./admin/user_sessions.js");

const testSessionID = "-MPscMFlTngGQt_CyvqJ";
const stretchSessionID = "-MQ5ymANs7HAbkVusdEr";


// userSessions.setModerator("zOS2BL42Osb8ojwaZXRfyys9Juq1");
// userSessions.setParticipant(["qvFgAQhQQ5U3leY2YRX6L4YfR513", "3gkpYXa8k2daQVe63k0YTfGjl6E2"]);

// userSessions.addSession("Stretch & Strengthen", Date.parse("2021-01-08 17:45 +10:30")/1000);

// userSessions.updateSession(stretchSessionID, {start: Date.parse("2021-01-08 19:45 +10:30")/1000});

// const start = Date.parse("2021-01-08 23:00 +10:30")/1000;
// const end = start + 24*60*60;
// userSessions.updateSession(testSessionID, {start, end});

// userSessions.setModerator("qvFgAQhQQ5U3leY2YRX6L4YfR513");

// userSessions.listSessions().then(console.log);

// userSessions.listUsers().then(console.log);

// userSessions.getUserData("Tp6WPruKcudEJwKgEncOxqU2LNv1").then(console.log);

userSessions.cleanUp();
