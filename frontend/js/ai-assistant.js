document.addEventListener("DOMContentLoaded", () => {

  const robot = document.getElementById("ai-robot");
  const chatbox = document.getElementById("ai-chatbox");
  const closeBtn = document.getElementById("ai-close");
  const inputField = document.querySelector(".ai-input input");
  const sendBtn = document.querySelector(".ai-input button");
  const messages = document.querySelector(".ai-messages");

  robot.onclick = () => chatbox.style.display = "flex";
  closeBtn.onclick = () => chatbox.style.display = "none";

  async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    addMessage(text, "user");
    inputField.value = "";

    const typing = addMessage("🤖 is typing...", "typing");

    try {
      // const res = await fetch("http://127.0.0.1:5000/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ message: text })
      // });   //this is was commented to connect the ai-assistent with the real render deployed backend
      const API_BASE = "https://uday-portfolio-backend-service.onrender.com";
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });


      const data = await res.json();
      typing.remove();

      if (data.type === "action") {
        addMessage(data.reply, "bot");
        window.open(data.url, "_blank");
      } else {
        addMessage(data.reply, "bot");
      }

    } catch {
      typing.remove();
      addMessage("⚠️ Server unavailable", "bot");
    }
  }

  sendBtn.onclick = sendMessage;
  inputField.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = `ai-message ${type}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
});



