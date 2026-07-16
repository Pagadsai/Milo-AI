export default function Header() {
    return (
      <div
        style={{
          height: "80px",
          background: "#111827",
          borderBottom: "1px solid #2d3748",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 25px",
        }}
      >
        {/* Left Side */}
        <div>
          <h1
            style={{
              color: "white",
              margin: 0,
              fontSize: "30px",
            }}
          >
            🤖 Milo AI
          </h1>
  
          <p
            style={{
              color: "#9ca3af",
              margin: 0,
              fontSize: "14px",
            }}
          >
            Your Personal AI Sign Language Assistant
          </p>
        </div>
  
        {/* Right Side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          ></div>
  
          <span
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Online
          </span>
        </div>
      </div>
    );
  }