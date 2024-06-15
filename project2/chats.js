const uuid = require("uuid").v4;
const uuid1 = uuid();
const uuid2 = uuid();
const messagesList = {
  [uuid1]: {
    username: "Amit",
    message: "Hello",
  },
  [uuid2]: {
    username: "Bao",
    message: "Bonjour!",
  },
};

function newChat(username, message) {
  const id = uuid();
  messagesList[id] = {
    username,
    message,
  };
  return messagesList;
}
module.exports = {
  newChat,
  messagesList,
};
