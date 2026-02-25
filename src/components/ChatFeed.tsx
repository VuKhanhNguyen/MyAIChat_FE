"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "../types";
import { MessageBubble } from "./MessageBubble";

interface ChatFeedProps {
  messages: ChatMessage[];
  isTyping?: boolean;
}

export const ChatFeed: React.FC<ChatFeedProps> = ({ messages, isTyping }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolledUp, setIsScrolledUp] = useState(false);

  // Auto-scroll logic vs Manual Scroll logic
  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    // If we are more than 100px away from the bottom, user scrolled up
    const isUp = scrollHeight - scrollTop - clientHeight > 100;
    setIsScrolledUp(isUp);
  };

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  // Scroll to bottom on new messages if not manually scrolled up
  useEffect(() => {
    if (!isScrolledUp) {
      scrollToBottom();
    }
  }, [messages, isTyping, isScrolledUp]);

  return (
    <div className="relative flex-1 h-full w-full overflow-hidden bg-zinc-950/40">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overflow-x-hidden pt-24 pb-36 px-4 md:px-8 xl:px-0 max-w-4xl mx-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-70">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-emerald-600/20 to-cyan-500/20 flex items-center justify-center backdrop-blur-3xl shadow-[0_0_40px_rgba(16,185,129,0.1)] border border-emerald-500/20"
            >
              <svg
                className="w-10 h-10 text-emerald-400 opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </motion.div>
            <p className="text-zinc-400 text-lg font-medium tracking-wide">
              How can I assist you today?
            </p>
            <p className="text-zinc-600 text-sm mt-2">
              Start typing to interact with the ultra-modern AI model.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative z-10">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <MessageBubble
                message={{
                  id: "typing",
                  role: "assistant",
                  content: "",
                  timestamp: new Date(),
                  metadata: { isTyping: true, modelUsed: "ultra" },
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Floating "Scroll to Bottom" button */}
      <AnimatePresence>
        {isScrolledUp && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 
                       flex items-center gap-2 px-4 py-2 rounded-full 
                       bg-zinc-800/80 backdrop-blur-md border border-white/10 shadow-[0_4_20px_rgba(0,0,0,0.5)]
                       text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-all
                       focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none group"
            aria-label="Scroll to newest messages"
          >
            <span>New Messages</span>
            <svg
              className="w-4 h-4 text-emerald-500 group-hover:translate-y-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
