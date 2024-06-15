const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

const { newChat, messagesList } = require("./chats");
const sessions = require("./sessions");
const users = require("./users");

app.use(cookieParser());
app.use(express.static("./public"));
app.use(express.json());

// Sessions
app.get("/api/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  res.json({ username });
});

app.post("/api/session", (req, res) => {
  const { username } = req.body;
  if (!users.isValid(username)) {
    res.status(400).json({ error: "required-username" });
    return;
  }
  if (username === "dog") {
    res.status(403).json({ error: "auth-insufficient" });
    return;
  }

  const sid = sessions.addSession(username);
  res.cookie("sid", sid);
  res.json(messagesList);
});

app.delete("/api/session", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (sid) {
    res.clearCookie("sid");
  }
  if (username) {
    sessions.deleteSession(sid);
  }

  res.json({ username });
});

// chats
app.get("/api/chats", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  res.json(messagesList);
});

app.post("/api/chats", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: "required-message" });
    return;
  }
  const messagesList = newChat(username, message);
  res.json(messagesList).status(200);
});

app.get("/api/chats/:id", (req, res) => {
  const sid = req.cookies.sid;
  const username = sid ? sessions.getSessionUser(sid) : "";
  if (!sid || !users.isValid(username)) {
    res.status(401).json({ error: "auth-missing" });
    return;
  }
  const chatList = users.getUserData(username);
  const { id } = req.params;
  if (!chatList.contains(id)) {
    res
      .status(404)
      .json({ error: `noSuchId`, message: `No Chat with id ${id}` });
    return;
  }
  res.json(chatList.getChat(id));
});

app.get("/api/users", (req, res) => {
  const users = [];
  const userList = sessions.sessions;
  // console.log(userList);
  Object.keys(userList).map((key) => {
    users.push(userList[key]);
  });
  res.json(users).status(200);
  return;
});
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
