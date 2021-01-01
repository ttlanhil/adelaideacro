const userSessions = require("./admin/user_sessions.js");

// TODO: add a UI of some sort


// userSessions.setModerator("zOS2BL42Osb8ojwaZXRfyys9Juq1");
// userSessions.setModerator("qvFgAQhQQ5U3leY2YRX6L4YfR513", false);
// userSessions.setParticipant(["qvFgAQhQQ5U3leY2YRX6L4YfR513", "3gkpYXa8k2daQVe63k0YTfGjl6E2"]);
// userSessions.setParticipant("tb8ITLXz9qhWYV3vfqNTEKpYX9q1", false);

// userSessions.addSession("test session", Date.parse("2021-01-08 17:30 +10:30")/1000);

// userSessions.updateSession("-MProPvI55GP5xtoz-pl", {modOnly: true});

userSessions.listSessions();

userSessions.listUsers();

// userSessions.updateByUser("tb8ITLXz9qhWYV3vfqNTEKpYX9q1");
// userSessions.updateByUser(["tb8ITLXz9qhWYV3vfqNTEKpYX9q1", "zOS2BL42Osb8ojwaZXRfyys9Juq1", "qvFgAQhQQ5U3leY2YRX6L4YfR513", "3gkpYXa8k2daQVe63k0YTfGjl6E2"]);

// userSessions.getUserData("J8PCPeWW3wZOKKDfcNRQuo8WrDS2").then(console.log);

// userSessions.updateSession("-MProPvI55GP5xtoz-pl", {start: 1609491600});
// userSessions.updateSession("-MPscMFlTngGQt_CyvqJ", {start: 1610089200});

// userSessions.setParticipant("J8PCPeWW3wZOKKDfcNRQuo8WrDS2");

