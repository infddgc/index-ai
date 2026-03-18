const API_KEY = "tgp_v1_dF02yOUYxQwHn7q_yxVxnvjvl393Q07VJG5xRgjf5rk";

// AUTH
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");

if (localStorage.getItem("user")) {
  showApp();
}

function register() {
  const login = document.getElementById("login").value;
  const pass = document.getElementById("password").value;

  if (!login || !pass) return alert("Заполни всё");

  localStorage.setItem("user_" + login, pass);
  alert("Аккаунт создан");
}

function loginUser() {
  const login = document.getElementById("login").value;
  const pass = document.getElementById("password").value;

  const saved = localStorage.getItem("user_" + login);

  if (saved === pass) {
    localStorage.setItem("user", login);
    showApp();
  } else {
    alert("Ошибка входа");
  }
}

function logout() {
  localStorage.removeItem("user");
  location.reload();
}

function showApp() {
  authDiv.style.display = "none";
  appDiv.style.display = "flex";
}

// CHAT
const chatDiv = document.getElementById("chat");
const input = document.getElementById("msg");
const sidebar = document.getElementById("sidebar");

let chats = JSON.parse(localStorage.getItem("index_chats") || "{}");
let currentChat = null;

input?.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
});

function toggleMenu() {
  sidebar.classList.toggle("active");
}

function newChat() {
  const id = "Чат";
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
  div.innerText = text;
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function send() {
  const text = input.value;
  if (!text || !currentChat) return;

  addMessage(text, true);
  chats[currentChat].push({ role: "user", content: text });
  input.value = "";

  try {
    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3-8B-Instruct",
        max_tokens: 200,
        messages: chats[currentChat]
      })
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Ошибка";

    addMessage(reply, false);
    chats[currentChat].push({ role: "assistant", content: reply });

    save();

  } catch {
    addMessage("❌ Ошибка сети", false);
  }
}

function save() {
  localStorage.setItem("index_chats", JSON.stringify(chats));
}

renderChats();
