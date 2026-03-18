export function saveChats(chats) {
  localStorage.setItem("chats", JSON.stringify(chats));
}

export function loadChats() {
  return JSON.parse(localStorage.getItem("chats") || "{}");
}

export function autosave(chats) {
  setInterval(() => saveChats(chats), 5000);
}
