// ChatBox.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const Chat = ({ roomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    // Load existing messages
    axios.get(`http://localhost:8000/api/chat/${roomId}/messages/`)
      .then((res) => setMessages(res.data));

    // Open WebSocket
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/`);

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.current.close();
  }, [roomId]);

  const sendMessage = () => {
    ws.current.send(JSON.stringify({
      message: input,
      sender_id: currentUser.id,
    }));
    setInput("");
  };

  return (
    <div className="chat-box border p-4 rounded-lg w-full h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-1 rounded ${
              msg.sender_id === currentUser.id ? "bg-blue-100" : "bg-gray-100"
            }`}
          >
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
