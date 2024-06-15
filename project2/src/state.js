import { MESSAGES } from "./constants";

const state = {
  chats: {},
  isLoggedIn: false,
  isLoginPending: true,
  isChatPending: false,
  username: "",
  lastAddedChatId: "",
  error: "",
  users: [],
  
};

export function waitOnLogin() {
  state.isLoggedIn = false;
  state.isLoginPending = true;
  state.username = "";
  state.chats = {};
  state.error = "";
}
export function waitOnActiveUserList() {
  state.isLoginPending = true;
}


export function login(username) {
  state.isLoggedIn = true;
  state.isLoginPending = false;
  state.username = username;
  state.error = "";
  state.lastAddedChatId = "";
}

export function logout() {
  state.isLoggedIn = false;
  state.isLoginPending = false;
  state.username = "";
  state.chats = {};
  state.error = "";
}

export function waitOnChats() {
  state.chats = {};
  state.isChatPending = true;
  state.error = "";
}

export function setChats(chats) {
  state.chats = chats;
  state.isChatPending = false;
  state.error = "";
  state.lastAddedChatId = "";
}

export function addChat(chat, id) {
  state.chats = chat;
  state.lastAddedChatId = id;
  state.error = "";
}

export function setError(error) {
  if (!error) {
    state.error = "";
    return;
  }
  state.isLoginPending = false;
  state.error = MESSAGES[error] || MESSAGES.default;
}

export function setUsers(users) {
  state.users = users;
  state.isLoginPending=false;
}

export default state;
