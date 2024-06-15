import { SERVER, CLIENT } from "./constants";

import state, { login, logout, setChats, setError } from "./state";

import { fetchSession, fetchChats } from "./services";
import render from "./render";
import {
  addAbilityToLogin,
  addAbilityToLogout,
  addAbilityToRefresh,
  addAbilityToAddChat,
} from "./listeners";

import { startPolling } from "./listeners";

const appEl = document.querySelector("#app");
render({ state, appEl });
addAbilityToLogin({ state, appEl });
addAbilityToLogout({ state, appEl });
addAbilityToRefresh({ state, appEl });
addAbilityToAddChat({ state, appEl });
checkForSession();

function checkForSession() {
  
  fetchSession()
    .then((session) => {
      login(session.username);
      render({ state, appEl });
      return fetchChats();
    })
    .catch((err) => {
      if (err?.error === SERVER.AUTH_MISSING) {
        return Promise.reject({ error: CLIENT.NO_SESSION });
      }
      return Promise.reject(err);
    })
    .then((chats) => {
      setChats(chats);
      render({ state, appEl });
      startPolling();
    })
    .catch((err) => {
      if (err?.error == CLIENT.NO_SESSION) {
        logout();
        render({ state, appEl });
        return;
      }

      setError(err?.error || "ERROR");
      render({ state, appEl });
    });
}
