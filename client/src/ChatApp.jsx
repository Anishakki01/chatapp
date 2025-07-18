import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function ChatApp() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("send_message", { message });
      setChat((prev) => [...prev, { message, self: true }]);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, { message: data.message, self: false }]);
    });

    return () => socket.off("receive_message");
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", textAlign: "center" }}>
      <h2>💬 Real-Time Chat</h2>
      <div style={{
        minHeight: "200px",
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
        overflowY: "auto"
      }}>
        {chat.map((c, i) => (
          <div key={i} style={{ textAlign: c.self ? "right" : "left" }}>
            <span style={{
              background: c.self ? "#d1f7c4" : "#f0f0f0",
              padding: "5px 10px",
              borderRadius: "10px",
              display: "inline-block",
              margin: "4px"
            }}>
              {c.message}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ padding: "10px", width: "70%" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px 20px", marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default ChatApp;
