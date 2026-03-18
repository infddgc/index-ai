import { sendMessageStream } from "./chat_stream.js";
import { addMessage } from "../components/message.js";
import { chats, currentChat } from "./chat_manager.js";

const input = document.getElementById("input");

input.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
      const text = input.value.trim();
      input.value = "";
      if (!text) return;
      await sendMessageStream(text, addMessage, chats, currentChat);
  }
});
