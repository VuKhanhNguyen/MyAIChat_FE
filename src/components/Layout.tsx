import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ModelDropdown } from "./ModelDropdown";
import { ChatFeed } from "./ChatFeed";
import { PromptInput } from "./PromptInput";
import type { UserModel, ChatMessage, ModelTier } from "../types";

interface LayoutProps {
  user: UserModel;
  // In a real app, these would come from a data store/context
  initialMessages?: ChatMessage[];
}

export const Layout: React.FC<LayoutProps> = ({
  user,
  initialMessages = [],
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState<ModelTier>(
    "google/gemini-2.0-pro-exp-02-05:free",
  );
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Handler for sending messages to the true backend
  const handleSendMessage = async (content: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          modelTier: currentModel,
          // If we had a real session mechanism, we would pass `sessionId` here.
          // Our backend controller gracefully handles a missing sessionId by creating a new one.
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();

      if (json.success && json.data?.aiMessage) {
        const aiMessageData = json.data.aiMessage;

        const newAIMsg: ChatMessage = {
          id: aiMessageData._id || (Date.now() + 1).toString(),
          role: "assistant",
          content: aiMessageData.content,
          timestamp: new Date(aiMessageData.createdAt || Date.now()),
          metadata: {
            modelUsed: aiMessageData.metadata?.modelUsed,
            tokensUsed: aiMessageData.metadata?.tokensUsed,
          },
        };

        setMessages((prev) => [...prev, newAIMsg]);
      } else {
        throw new Error("Invalid response structure from backend");
      }
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "⚠️ Error: Could not connect to the Luminous AI Core. Please ensure the backend is running on port 5000.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Semantic HTML5 Structure: <main> wrapper */}
      <main className="relative flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* Semantic HTML5 Structure: <nav> via <aside> within Sidebar component */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
          user={user}
        />

        {/* Main Content Area */}
        <section
          className={`flex-1 flex flex-col relative transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "ml-0"}`}
        >
          {/* Top Navigation Bar - Glassmorphic */}
          <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 bg-zinc-950/70 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-expanded={isSidebarOpen}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isSidebarOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>

              {!isSidebarOpen && (
                <h1 className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 hidden sm:block">
                  Luminous
                </h1>
              )}
            </div>

            {/* AI Model Toggle Area */}
            <nav aria-label="Model selection">
              <ModelDropdown
                currentModel={currentModel}
                onModelChange={setCurrentModel}
              />
            </nav>

            <div className="w-8 sm:w-[92px] flex justify-end">
              {/* Spacer to balance the header (width of menu button + brand text) or placeholder for user actions */}
              <button
                className="p-2 text-zinc-400 hover:text-emerald-400 rounded-full hover:bg-zinc-800/50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none sm:hidden"
                aria-label="New chat"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Chat Feed */}
          <ChatFeed messages={messages} isTyping={isTyping} />

          {/* Sticky Input Area at Bottom */}
          <footer className="absolute bottom-0 inset-x-0 pb-6 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-30">
            <PromptInput onSend={handleSendMessage} disabled={isTyping} />
          </footer>
        </section>
      </main>
    </>
  );
};
