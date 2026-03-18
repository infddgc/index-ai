const chatDiv = document.getElementById("chat");
const typing = document.getElementById("typing");

let chats = JSON.parse(localStorage.getItem("index_chats") || "{}");
let currentChat = null;

// ===== ENTER ОТПРАВКА =====
msg.addEventListener("keypress", e => {
  if (e.key === "Enter") send();
});

// ===== ЧАТЫ =====
function newChat() {
  const id = "Chat " + Date.now();
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

// ===== СООБЩЕНИЯ =====
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
    stream(text, div);
  }

  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

// ===== СТРИМИНГ =====
function stream(text, el) {
  let i = 0;
  const speed = 6;

  const interval = setInterval(() => {
    el.innerText += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

// ===== ОТПРАВКА =====
async function send() {
  const text = msg.value;
  if (!text || !currentChat) return;

  addMessage(text, true);
  chats[currentChat].push({ role: "user", content: text });

  msg.value = "";
  typing.style.display = "block";

  const res = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer tgp_v1_70-LWiq-vf0vDkNPoQ1hYLdAeQZlv25RpyORWm4e_cw",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      messages: chats[currentChat]
    })
  });

  const data = await res.json();
  const reply = data.choices[0].message.content;

  typing.style.display = "none";

  chats[currentChat].push({ role: "assistant", content: reply });
  save();

  addMessage(reply, false);
  speak(reply);
}

// ===== ОЧИСТКА =====
function clearChat() {
  if (!currentChat) return;
  chats[currentChat] = [];
  save();
  renderMessages();
}

// ===== СОХРАНЕНИЕ =====
function save() {
  localStorage.setItem("index_chats", JSON.stringify(chats));
}

// ===== ГОЛОС =====
function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "ru-RU";
  speechSynthesis.speak(speech);
}

function voice() {
  const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  rec.lang = "ru-RU";

  rec.onresult = e => {
    msg.value = e.results[0][0].transcript;
  };

  rec.start();
}

// запуск
renderChats();