export default function ChatList({
    chats,
    currentChat,
    setCurrentChat,
  }) {
    return (
      <>
        {chats.map((chat, index) => (
          <div
            key={index}
            onClick={() => setCurrentChat(index)}
            style={{
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              background:
                currentChat === index
                  ? "#2563eb"
                  : "#1f2937",
              color: "white",
              transition: "0.3s",
            }}
          >
            💬 {chat.title}
          </div>
        ))}
      </>
    );
  }