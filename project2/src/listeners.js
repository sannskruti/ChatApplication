import {
  fetchLogin,
  fetchLogout,
  fetchChats,
  fetchAddChat,
  fetchUsers,
} from "./services";

import state, {
  waitOnChats,
  waitOnLogin,
  setChats,
  setError,
  login,
  logout,
  addChat,
  setUsers,
  waitOnActiveUserList,
} from "./state";

import render from "./render";
const appEl = document.querySelector("#app");
let pollingInterval;

export function startPolling() {
  pollingInterval = setTimeout(() => {
    checkNewChat();
    startPolling();
  }, 5000);
}

function stopPolling() {
  clearTimeout(pollingInterval);
}

function checkNewChat() {
  waitOnActiveUserList();
  fetchUsers()
    .then((users) => {
      setUsers(users);

      render({ state, appEl });

      return fetchChats();
    })
    .catch((err) => {
      setError(err?.error || "ERROR");
      render({ state, appEl });
    })
    .then((chats) => {
      setChats(chats);

      render({ state, appEl });
    })
    .catch((err) => {
      setError(err?.error || "ERROR");
      render({ state, appEl });
    });
}

export function addAbilityToLogin({ state, appEl }) {
  appEl.addEventListener("submit", (e) => {
    if (!e.target.classList.contains("login__form")) {
      return;
    }
    e.preventDefault();

    const username = appEl.querySelector(".login__username").value;
    const userList = appEl.querySelector(".user_list");
    waitOnLogin();
    render({ state, appEl });
    fetchLogin(username)
      .then((chats) => {
        login(username);
        setChats(chats);
        return fetchUsers();
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        render({ state, appEl });
      })
      .then((users) => {
        setUsers(users);

        render({ state, appEl });
        startPolling();
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        render({ state, appEl });
      });
  });
}

export function addAbilityToLogout({ state, appEl }) {
  appEl.addEventListener("click", (e) => {
    if (!e.target.classList.contains("controls__logout")) {
      return;
    }
    logout();
    render({ state, appEl });
    fetchLogout()
      .then(() => {
        return fetchUsers();
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        render({ state, appEl });
      })
      .then((users) => {
        setUsers(users);
        stopPolling();
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        render({ state, appEl });
      });
  });
}

export function addAbilityToRefresh({ state, appEl }) {
  appEl.addEventListener("click", (e) => {
    if (!e.target.classList.contains("controls__refresh")) {
      return;
    }
    waitOnChats();
    render({ state, appEl });
    fetchChats()
      .then((chats) => {
        setChats(chats);
        render({ state, appEl });
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        render({ state, appEl });
      });
  });
}

export function addAbilityToAddChat({ state, appEl }) {
  appEl.addEventListener("submit", (e) => {
    if (!e.target.classList.contains("add__form")) {
      return;
    }
    const message = appEl.querySelector(".add__message").value;

    fetchAddChat(message)
      .then((chat) => {
        addChat(chat, chat.id);
        render({ state, appEl });
      })
      .catch((err) => {
        setError(err?.error || "ERROR");
        render({ state, appEl });
      });
  });
}
