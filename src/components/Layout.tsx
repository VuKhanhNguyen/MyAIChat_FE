import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { ModelDropdown } from "./ModelDropdown";
import { ChatFeed } from "./ChatFeed";
import { PromptInput } from "./PromptInput";
import type {
  UserModel,
  ChatMessage,
  ModelTier,
  ChatSessionMeta,
} from "../types";

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

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSessionMeta[]>([]);

  // Fetch all chat sessions on load
  const loadSessions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat/sessions");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSessions(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  React.useEffect(() => {
    loadSessions();
  }, []);

  // Fetch messages for a specific session
  const handleSelectSession = async (sessionId: string) => {
    try {
      if (window.innerWidth < 1024) setSidebarOpen(false);

      setMessages([]); // clear current chat view
      setIsTyping(true); // show loader or at least block input briefly

      const res = await fetch(
        `http://localhost:5000/api/chat/session/${sessionId}`,
      );
      if (!res.ok) throw new Error("Failed to load session");

      const json = await res.json();
      if (json.success && json.data) {
        setCurrentSessionId(sessionId);

        // Map backend message format to frontend ChatMessage format
        const historyMessages: ChatMessage[] = json.data.messages.map(
          (m: any) => ({
            id: m._id,
            role: m.role,
            content: m.content,
            timestamp: new Date(m.createdAt),
            metadata: {
              modelUsed: m.metadata?.modelUsed,
              tokensUsed: m.metadata?.tokensUsed,
              rateLimitRemaining: m.metadata?.rateLimitRemaining,
            },
          }),
        );
        setMessages(historyMessages);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        {
          id: "error",
          role: "assistant",
          content: "⚠️ Error loading chat history.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to wipe current chat
  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false); // Auto close sidebar on mobile after starting new chat
    }
  };

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
          sessionId: currentSessionId,
          content,
          modelTier: currentModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const json = await response.json();

      if (json.success && json.data?.aiMessage) {
        // Capture new session ID returned from backend if we started a fresh one
        if (json.data?.sessionId && !currentSessionId) {
          setCurrentSessionId(json.data.sessionId);
        }

        const aiMessageData = json.data.aiMessage;

        const newAIMsg: ChatMessage = {
          id: aiMessageData._id || (Date.now() + 1).toString(),
          role: "assistant",
          content: aiMessageData.content,
          timestamp: new Date(aiMessageData.createdAt || Date.now()),
          metadata: {
            modelUsed: aiMessageData.metadata?.modelUsed,
            tokensUsed: aiMessageData.metadata?.tokensUsed,
            rateLimitRemaining: aiMessageData.metadata?.rateLimitRemaining,
          },
        };

        setMessages((prev) => [...prev, newAIMsg]);

        // Refresh titles async so it doesn't block UI if this is a new session
        if (!currentSessionId) {
          loadSessions();
        }
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
          onNewChat={handleNewChat}
          sessions={sessions}
          activeSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
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
                rateLimitRemaining={
                  messages.length > 0
                    ? messages[messages.length - 1]?.metadata
                        ?.rateLimitRemaining
                    : null
                }
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
