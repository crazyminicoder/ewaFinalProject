// src/components/ChatBot.tsx

import { useState, useRef, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ChatBot = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ text: string, sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user" as const }; // Explicitly define the type
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      // Send message to backend
      try {
        const response = await fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: input }),
          });
          

        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          throw new Error("Failed to parse response as JSON.");
        }

        const botMessage = {
          text: data?.reply || "I'm sorry, I didn't understand that.",
          sender: "bot" as const, // Explicitly define the type
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error getting response:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, I couldn't process that request.", sender: "bot" as const },
        ]);
      }
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleClose = () => {
    navigate("/"); // Navigates to the homepage
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Chat with AI</h3>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </div>
        <div className="flex flex-col space-y-2 h-64 overflow-y-auto border p-4 mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded ${
                message.sender === "user"
                  ? "bg-blue-100 text-blue-800 text-right"
                  : "bg-gray-200 text-gray-800 text-left"
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            fullWidth
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{
              backgroundColor: "#333333",
              color: "#ffffff",
              fontSize: "1rem",
              padding: "0.5rem",
            }}
            className="rounded-lg"
          />
          <Button onClick={handleSend} color="primary">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
