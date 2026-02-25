"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isAI = message.role === "assistant";
  const isTyping = message.metadata?.isTyping;

  // Animation variants for message appearance
  const bubbleVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      layout="position"
      className={`flex w-full ${isAI ? "justify-start" : "justify-end"} mb-6 px-4`}
    >
      <div
        className={`
          flex max-w-[85%] md:max-w-[75%] gap-4
          ${isAI ? "flex-row" : "flex-row-reverse"}
        `}
      >
        {/* Avatar Area */}
        <div className="flex-shrink-0 mt-1">
          {isAI ? (
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-emerald-400 text-xs font-bold tracking-widest">
                AI
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-400 text-xs font-bold uppercase">
                Me
              </span>
            </div>
          )}
        </div>

        {/* Content Bubble */}
        <div
          className={`
            relative group flex flex-col pt-1
            ${
              isAI
                ? "text-zinc-300" // AI uses transparent background, focus on text
                : "text-zinc-100 bg-zinc-800/60 rounded-2xl rounded-tr-sm px-5 py-3 border border-white/5 backdrop-blur-sm"
            }
          `}
        >
          {/* Metadata Display (e.g. Model used) */}
          {isAI && message.metadata?.modelUsed && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-500/70 select-none">
                {message.metadata.modelUsed}
              </span>
            </div>
          )}

          {/* Core Content */}
          <div
            className={`prose prose-invert max-w-none text-[15px] leading-relaxed ${isAI ? "text-zinc-300" : "text-zinc-100"}`}
          >
            {isTyping ? (
              <div className="flex items-center space-x-1.5 h-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-[bounce_1s_infinite_0ms] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-[bounce_1s_infinite_200ms]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-[bounce_1s_infinite_400ms]"></span>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Action Row (Visible on hover for AI messages) */}
          {!isTyping && isAI && (
            <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <button
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded"
                aria-label="Copy message"
                title="Copy"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
              <button
                className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded"
                aria-label="Refresh response"
                title="Regenerate"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
