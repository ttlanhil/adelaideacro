const userSessions = require("./admin/user_sessions.js");

// TODO: add a UI of some sort

// TODO: ability to prune old user accounts (particularly anonymous logins)


// userSessions.setModerator("zOS2BL42Osb8ojwaZXRfyys9Juq1");
// userSessions.setParticipant(["qvFgAQhQQ5U3leY2YRX6L4YfR513", "3gkpYXa8k2daQVe63k0YTfGjl6E2"]);

// userSessions.addSession("Stretch & Strengthen", Date.parse("2021-01-08 17:45 +10:30")/1000);
// userSessions.updateSession("-MQ5ymANs7HAbkVusdEr", {start: Date.parse("2021-01-08 19:45 +10:30")/1000});

const start = Date.parse("2021-01-05 23:00 +10:30")/1000;
const end = start + 24*60*60;
userSessions.updateSession("-MPscMFlTngGQt_CyvqJ", {start, end});

userSessions.setModerator("qvFgAQhQQ5U3leY2YRX6L4YfR513", false);

userSessions.listSessions();

userSessions.listUsers();

// userSessions.getUserData("J8PCPeWW3wZOKKDfcNRQuo8WrDS2").then(console.log);
