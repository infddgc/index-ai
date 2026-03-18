export function initSearch(chats, renderChats) {
  const input = document.createElement("input");
  input.placeholder = "Поиск по чатам...";
  input.oninput = () => {
    const filtered = Object.keys(chats).filter(k =>
      k.toLowerCase().includes(input.value.toLowerCase())
    );
    renderChats(filtered);
  };
  document.getElementById("sidebar").prepend(input);
}
