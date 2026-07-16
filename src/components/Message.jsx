export default function Message({ msg }) {
  return (
    <div
      style={{
        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
        background:
          msg.sender === "user" ? "#2563eb" : "#1f2937",
        color: "white",
        padding: "10px 14px",
        borderRadius: "10px",
        maxWidth: "60%",
      }}
    >
      {msg.text}
    </div>
  );
}