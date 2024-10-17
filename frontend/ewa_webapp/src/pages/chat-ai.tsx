// src/pages/chat-ai.tsx
import ChatBot from "@/components/ChatBot";
import DefaultLayout from "@/layouts/default";

const ChatBotPage = () => {
  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Chat with AI</h1>
        <ChatBot onClose={() => {}} /> {/* Pass a function if onClose is needed */}
      </div>
    </DefaultLayout>
  );
};

export default ChatBotPage;
