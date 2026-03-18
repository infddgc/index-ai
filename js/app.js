import { initAuth } from "./auth.js";
import { initChat } from "./chat.js";
import { initUI } from "./ui.js";
import { initVoice } from "./voice.js";
import { initSidebar } from "./sidebar.js";
import { initFileUpload } from "./file_upload.js";
import { autosave, loadChats } from "./storage.js";

function startApp() {
  initAuth();
  initUI();
  initChat();
  initVoice();
  initSidebar();
  initFileUpload(sendMessage);
  window.chats = loadChats();
  autosave(window.chats);
}

window.sendMessage = async text => {
  const chatModule = await import("./chat_stream.js");
  chatModule.sendMessageStream(text, window.addMessage, window.chats, window.currentChat);
};

startApp();
