import { useState, useRef, useEffect } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "bot";
  text: string;
  image?: string;
}

interface Chat {
  id: number;
  title: string;
  messages: Message[];
}

export default function FullPageGPTDashboard() {
  const [chats, setChats] = useState<Chat[]>([{ id: 1, title: "New Chat", messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);
  const [barangay, setBarangay] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentChat = chats.find((c) => c.id === currentChatId)!;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat.messages]);

  const addMessage = (msg: Message) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: [...chat.messages, msg] } : chat
      )
    );
  };

  // Pure text analyze function
  const analyze = async () => {
    const trimmedBarangay = barangay.trim();
    if (!trimmedBarangay) return;

    // Add user's message
    addMessage({ sender: "user", text: trimmedBarangay });
    setBarangay("");

    try {
      const res = await axios.get("http://127.0.0.1:8000/analyze", { params: { barangay: trimmedBarangay } });

      const floodLevel = res.data?.floodLevel;
      const evacuationCenters = res.data?.evacuationCenters || [];
      const image = res.data?.image;

      let botText = "";
      if (floodLevel) {
        botText += `Flood Level: ${floodLevel}\n`;
      }
      if (evacuationCenters.length > 0) {
        botText += `${floodLevel ? "Evacuation Centers:\n" : ""}• ${evacuationCenters.join("\n• ")}`;
      }

      // Add bot message instantly
      addMessage({ sender: "bot", text: botText, image });

    } catch (error) {
      console.error("API call failed:", error);
      addMessage({ sender: "bot", text: "Error fetching data." });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") analyze();
  };

  const newChat = () => {
    const newId = chats.length + 1;
    setChats([...chats, { id: newId, title: "New Chat", messages: [] }]);
    setCurrentChatId(newId);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 280,
          backgroundColor: "#202123",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          padding: 16,
        }}
      >
        <h2 style={{ marginBottom: 16 }}>MCP TESTER CHAT</h2>
        <button
          onClick={newChat}
          style={{
            padding: 8,
            marginBottom: 16,
            borderRadius: 8,
            border: "none",
            backgroundColor: "#10a37f",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + New Chat
        </button>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChatId(chat.id)}
              style={{
                padding: 10,
                marginBottom: 8,
                borderRadius: 8,
                cursor: "pointer",
                backgroundColor: chat.id === currentChatId ? "#343541" : "transparent",
              }}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#343541", color: "#fff" }}>
        {/* Messages */}
        <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {currentChat.messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  maxWidth: "70%",
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: msg.sender === "user" ? "#10a37f" : "#444654",
                  whiteSpace: "pre-line",
                  wordBreak: "break-word",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              >
                {msg.image && (
                  <img 
                    src={msg.image} 
                    alt="Pokemon" 
                    style={{ width: 96, height: 96, marginBottom: 8, borderRadius: 8 }}
                  />
                )}
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", padding: 12, borderTop: "1px solid #222", backgroundColor: "#40414f" }}>
          <input
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter barangay..."
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 24,
              border: "none",
              outline: "none",
              backgroundColor: "#303134",
              color: "#fff",
            }}
          />
          <button
            onClick={analyze}
            style={{
              marginLeft: 8,
              padding: "12px 24px",
              borderRadius: 24,
              border: "none",
              backgroundColor: "#10a37f",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
