import { renderProfile } from "../components/profile.js";

export function initAuth() {
  const app = document.getElementById("app");

  if (!localStorage.getItem("user")) {
      app.innerHTML = `
      <div class="auth">
          <h1>Index AI</h1>
          <input id="login" placeholder="Логин">
          <input id="password" type="password" placeholder="Пароль">
          <button id="registerBtn">Регистрация</button>
          <button id="loginBtn">Войти</button>
      </div>`;

      document.getElementById("registerBtn").onclick = register;
      document.getElementById("loginBtn").onclick = login;
  } else {
      app.innerHTML = <div id="layout"></div>;
      renderProfile();
  }
}

function register() {
  const l = login.value;
  const p = password.value;
  if (!l || !p) return alert("Заполни всё");
  localStorage.setItem("user_" + l, p);
  alert("Аккаунт создан");
}

function login() {
  const l = login.value;
  const p = password.value;
  if (localStorage.getItem("user_" + l) === p) {
      localStorage.setItem("user", l);
      location.reload();
  } else alert("Ошибка входа");
}
