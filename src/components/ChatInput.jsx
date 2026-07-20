export default function ChatInput({
    input,
    setInput,
    sendMessage,
    startListening,
    listening,
  }) {
    return (
      <div
        style={{
          display: "flex",
          gap: "10px",
          padding: "20px",
          borderTop: "1px solid #2d3748",
          background: "#111827",
        }}
      >
        <button
          onClick={startListening}
          style={{
            background: listening ? "#ef4444" : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 18px",
            cursor: "pointer",
            fontSize: "18px",
          }}
        >
          {listening ? "🎙️" : "🎤"}
        </button>
  
        <input
          type="text"
          placeholder="Ask Milo anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: "15px",
            fontSize: "17px",
            borderRadius: "12px",
            border: "2px solid #FFD700",
            outline: "none",
          }}
        />
  
        <button
          onClick={sendMessage}
          style={{
            background: "#FFD700",
            color: "black",
            border: "none",
            borderRadius: "10px",
            padding: "15px 25px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>
      </div>
    );
  }