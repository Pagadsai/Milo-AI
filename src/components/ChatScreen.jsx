import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import CameraPanel from "./CameraPanel";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Welcome! I am Milo AI" },
  ]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: generateReply(text),
        },
      ]);
    }, 500);
  };

  const generateReply = (text) => {
    text = text.toLowerCase();

    if (text.includes("hi")) return "Hello! 👋";
    if (text.includes("name")) return "I’m Milo AI 🤖";
    if (text.includes("react")) return "React builds UI using components.";
    return "I received: " + text;
  };

  return (
    <div style={styles.wrap}>
      <Sidebar />

      <div style={styles.center}>
        <ChatWindow
          messages={messages}
          sendMessage={sendMessage}
        />
      </div>

      <CameraPanel />
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    height: "100vh",
    background: "#0b1020",
  },
  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
