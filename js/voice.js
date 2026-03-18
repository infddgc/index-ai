export function initVoice() {
  if (!("speechSynthesis" in window) || !("webkitSpeechRecognition" in window)) return;

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.continuous = false;

  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.key === "v") {
      recognition.start();
    }
  });

  recognition.onresult = e => {
    const text = e.results[0][0].transcript;
    const input = document.getElementById("input");
    input.value = text;
    input.focus();
  };

  window.speak = text => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ru-RU";
    speechSynthesis.speak(utter);
  };
}
