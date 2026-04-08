import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

function TeamChat() {
  const { teamId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await API.get(`/chat/${teamId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    fetchMessages();

    socket.emit("join_team_room", teamId);

    socket.on("receive_message", (newMessage) => {
      if (newMessage.teamId === teamId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [teamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      const res = await API.post(`/chat/${teamId}`, { text });

      const liveMessage = {
        ...res.data,
        teamId,
      };

      socket.emit("send_message", liveMessage);
      setMessages((prev) => [...prev, liveMessage]);
      setText("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="page-shell">
      <div className="hero-card">
        <p className="eyebrow">Team Chat</p>
        <h1>Live Team Discussion</h1>
        <p className="hero-copy">
          Chat with your hackathon team in real time.
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <p className="meta-text">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id || Math.random()}
                className={`chat-bubble ${
                  msg.sender === user?._id || msg.sender?._id === user?._id
                    ? "my-message"
                    : "other-message"
                }`}
              >
                <strong>{msg.senderName}</strong>
                <p>{msg.text}</p>
                <span>
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef}></div>
        </div>

        <form className="chat-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn btn-orange">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamChat;