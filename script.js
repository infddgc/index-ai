const chatDiv = document.getElementById("chat");
let chats = JSON.parse(localStorage.getItem("index_chats") || "{}");
let currentChat = null;

// ENTER
document.getElementById("msg").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
});

// ЧАТЫ
function newChat() {
  const id = "Чат " + Date.now();
  chats[id] = [];
  currentChat = id;
  save();
  renderChats();
  renderMessages();
}

function renderChats() {
  chatList.innerHTML = "";
  for (let id in chats) {
    const div = document.createElement("div");
    div.innerText = id;
    div.onclick = () => {
      currentChat = id;
      renderMessages();
    };
    chatList.appendChild(div);
  }
}

// СООБЩЕНИЯ
function renderMessages() {
  chatDiv.innerHTML = "";
  if (!currentChat) return;

  chats[currentChat].forEach(m => {
    addMessage(m.content, m.role === "user");
  });
}

function addMessage(text, isUser) {
  const div = document.createElement("div");
  div.className = "message " + (isUser ? "user" : "bot");

  if (isUser) {
    div.innerText = text;
  } else {
    fastType(text, div);
  }

  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// БЫСТРАЯ ПЕЧАТЬ
function fastType(text, el) {
  let i = 0;
  const speed = 2;

  const interval = setInterval(() => {
    el.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// АВТО НАЗВАНИЕ
async function generateTitle(text) {
  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer ТВОЙ_API_КЛЮЧ",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: [
        { role: "system", content: "Короткое название чата (2-3 слова)" },
        { role: "user", content: text }
      ],
      max_tokens: 10
    })
  });

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// ОТПРАВКА
async function send() {
  const input = document.getElementById("msg");
  const text = input.value;

  if (!text || !currentChat) return;

  addMessage(text, true);
  chats[currentChat].push({ role: "user", content: text });

  input.value = "";

  // авто название
  if (chats[currentChat].length === 1) {
    const title = await generateTitle(text);
    chats[title] = chats[currentChat];
    delete chats[currentChat];
    currentChat = title;
    renderChats();
  }

  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer ТВОЙ_API_КЛЮЧ",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      max_tokens: 200,
      temperature: 0.7,
      messages: chats[currentChat]
    })
  });

  const data = await res.json();
  const reply = data.choices[0].message.content;

  chats[currentChat].push({ role: "assistant", content: reply });
  save();

  addMessage(reply, false);
}

// СОХРАНЕНИЕ
function save() {
  localStorage.setItem("index_chats", JSON.stringify(chats));
}

// СТАРТ
renderChats();
renderChats();
