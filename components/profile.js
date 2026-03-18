export function renderProfile() {
  const layout = document.getElementById("layout");
  const username = localStorage.getItem("user") || "Гость";

  const profileDiv = document.createElement("div");
  profileDiv.id = "profile";
  profileDiv.innerHTML = `
    <h2>Профиль</h2>
    <p>Пользователь: ${username}</p>
    <label>Новый логин: <input id="newLogin" placeholder="Новый логин"></label>
    <label>Новый пароль: <input id="newPass" type="password" placeholder="Новый пароль"></label>
    <button id="saveProfile">Сохранить</button>
    <button id="closeProfile">Назад</button>
  `;
  layout.appendChild(profileDiv);

  document.getElementById("saveProfile").onclick = saveProfile;
  document.getElementById("closeProfile").onclick = () => { profileDiv.remove(); };
}

function saveProfile() {
  const oldUser = localStorage.getItem("user");
  const newLoginVal = document.getElementById("newLogin").value.trim();
  const newPassVal = document.getElementById("newPass").value.trim();

  if (newLoginVal) {
    localStorage.setItem("user_" + newLoginVal, newPassVal || "");
    localStorage.removeItem("user_" + oldUser);
    localStorage.setItem("user", newLoginVal);
    alert("Профиль обновлён!");
    location.reload();
  } else alert("Логин не может быть пустым");
}
