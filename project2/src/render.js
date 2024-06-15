function render({ state, appEl }) {
  const html = `
     <main class="">
      <p class="heading">Chat Application</p>
       ${generateStatusHtml(state)}
       ${generateLoginHtml(state)}
       ${generateContentHtml(state)}
     </main>
    `;
  appEl.innerHTML = html;
}

function generateStatusHtml(state) {
  return `
        <div class="status">${state.error}</div>
    `;
}

function generateLoginHtml(state) {
  if (state.isLoginPending) {
    return `
        <div class="login__waiting">Loading user...</div>
      `;
  }
  if (state.isLoggedIn) {
    return ``;
  }
  return `
        <div class="login">
          <form class="login__form" action="#/login">
            <label>
              <input class="login__username" value="" placeholder="Username">
            </label>
            <button class="login__button" type="submit">Login</button>
          </form>
        </div>
    `;
}

function generateContentHtml(state) {
  if (!state.isLoggedIn) {
    return ``;
  }
  if (state.isChatPending) {
    return `
      <div class="content">
        ${generateControlsHtml(state)}
        <div class="chats__waiting">Loading Chats...</div>
      </div>
    `;
  }
  return `
      <div class="content">
        ${generateControlsHtml(state)}
        <div class="chat__area">
          <ul class="chats">${generateChatsHtml(state)}</ul>
          ${generateAddChatHtml(state)}
        </div>
      </div>
  `;
}

function generateControlsHtml(state) {
  return `
    <div class="controls">
     
      <button class="controls__refresh">Refresh</button>
      <button class="controls__logout">Logout</button>
      <p class="login-caption">Logged in as: ${state.username}</p>
      <div class="user_list">
      
      ${state.isLoginPending===true ? `<div class="login__waiting">Loading user...</div>`:  state.users
      ? state.users
          .map((user) => `<p class="active_user">${user}</p>`)
          .join("")
      : "no users" }
      </div>
    </div>
  `;
}

function generateChatsHtml(state) {
  const chatsHtml =
    Object.values(state.chats)
      .map((chat) => {
        const isAddedClass =
          state.lastAddedChatId === chat.id ? "chat__text--added" : "";
        return `
      <li class="chat">
          <span>
            ${chat.username} :  ${chat.message}
          </span>
      </li>
      `;
      })
      .join("") || `<p>No chats yet, add your message!</p>`;
  return chatsHtml;
}

function generateAddChatHtml(state) {
  return `
        <form class="add__form" action="#/add">
        <input class="add__message" placeholder="Enter your message...">
        <button type="submit" id="send-button" class="add__button">Send</button>
        </form>
  `;
}

export default render;
