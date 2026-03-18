import { saveChats, loadChats } from "./storage.js";

export let chats = loadChats();
export let currentChat = null;

export function newChat() {
  if (currentChat && chats[currentChat]?.length === 0) delete chats[currentChat];

  const id = "Чат " + (Object.keys(chats).length + 1);
  chats[id] = [];
  currentChat = id;
  renderChats();
  renderMessages();
  saveChats(chats);
}

export function renderChats(filterList = null) {
  const chatList = document.getElementById("chatList");
  chatList.innerHTML = "";
  const keys = filterList || Object.keys(chats);
  keys.forEach(id => {
      const div = document.createElement("div");
      div.innerText = id;
      div.onclick = () => {
          currentChat = id;
          renderMessages();
      };
      chatList.appendChild(div);
  });
}

export function renderMessages() {
  const chatDiv = document.getElementById("messages");
  chatDiv.innerHTML = "";
  if (!currentChat) return;

  chats[currentChat].forEach(msg => {
      const div = document.createElement("div");
      div.className = msg.role === "user" ? "user" : "bot";
      div.innerText = msg.content;
      chatDiv.appendChild(div);
  });
}
