export function addMessage(text, isUser, isStream = false) {
  const messages = document.getElementById("messages");
  let div;

  if (isStream) {
    div = messages.querySelector(".stream") || document.createElement("div");
    div.className = "bot stream";
    div.innerText = text;
    if (!messages.contains(div)) messages.appendChild(div);
  } else {
    div = document.createElement("div");
    div.className = isUser ? "user" : "bot";
    div.innerText = text;
    messages.appendChild(div);
  }
  messages.scrollTop = messages.scrollHeight;
  return div;
}
