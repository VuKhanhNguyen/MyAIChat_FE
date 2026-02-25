"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface PromptInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  onSend,
  disabled,
}) => {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic for textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      // Cap the height to 200px (to prevent taking over the whole screen)
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height =
        Math.min(Math.max(scrollHeight, 44), 200) + "px";
    }
  }, [content]);

  const handleSubmit = () => {
    if (!content.trim() || disabled) return;
    onSend(content.trim());
    setContent("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "44px";
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (prevent on Shift+Enter)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 xl:px-0 relative z-20">
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0px 40px -10px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.4)"
            : "0 0px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
        transition={{ duration: 0.3 }}
        className="relative flex items-end gap-2 p-2 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl"
      >
        {/* Helper Action Buttons (Attach file, Voice) */}
        <div className="flex pb-1 pl-2 gap-1 flex-shrink-0">
          <button
            type="button"
            className="p-2 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
            aria-label="Attach file"
          >
            <svg
              className="w-5 h-5 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
        </div>

        {/* Dynamic Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Message Luminous AI..."
          className="flex-1 max-h-[200px] min-h-[44px] py-3 px-2 bg-transparent text-zinc-100 placeholder:text-zinc-600 outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-700 leading-relaxed"
          rows={1}
          aria-label="Message prompt input"
          disabled={disabled}
        />

        {/* Send Action */}
        <div className="pb-1 pr-1 flex-shrink-0">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!content.trim() || disabled}
            className={`
              flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
              focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none
              ${
                content.trim() && !disabled
                  ? "bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:bg-emerald-400"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }
            `}
            aria-label="Send message"
          >
            <svg
              className={`w-5 h-5 ${content.trim() && !disabled ? "translate-x-0.5 -translate-y-0.5" : ""} transition-transform`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </motion.div>
      <div className="text-center mt-3">
        <p className="text-[11px] text-zinc-500 font-medium">
          Luminous AI can make mistakes. Verify critical code and output.
        </p>
      </div>
    </div>
  );
};
