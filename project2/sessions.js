const uuid = require("uuid").v4;

const sessions = {};
const chatList = {};

function addSession(username) {
  const existingSession = Object.values(sessions).find(
    (session) => session === username
  );
  if (existingSession) {
    return Object.keys(sessions).find((sid) => sessions[sid] === username);
  } else {
    const sid = uuid();
    sessions[sid] = username;
    return sid;
  }
}

function getSessionUser(sid) {
  return sessions[sid];
}

function deleteSession(sid) {
  delete sessions[sid];
}

function setChatMessage(sid, message) {
  chatList[sid] = message;
}

module.exports = {
  addSession,
  deleteSession,
  getSessionUser,
  sessions,
};
