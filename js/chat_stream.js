import { CONFIG } from "../config/config.js";

export async function sendMessageStream(text, addMessage, chats, currentChat) {
  addMessage(text, true);
  chats[currentChat] = chats[currentChat] || [];
  chats[currentChat].push({ role: "user", content: text });

  let replyDiv = addMessage("", false, true);

  try {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
          "Authorization": "Bearer " + CONFIG.API_KEY,
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          model: CONFIG.MODEL,
          max_tokens: CONFIG.MAX_TOKENS,
          messages: chats[currentChat],
          stream: true
      })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      replyDiv.innerText = buffer;
      if (localStorage.getItem("voice") !== "false") window.speak(buffer);
    }

    chats[currentChat].push({ role: "assistant", content: buffer });

  } catch (e) {
    replyDiv.innerText = "❌ Ошибка сети";
  }
}
