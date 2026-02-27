"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModelTier } from "../types";

export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description: string;
}

export const FREE_MODELS: ModelOption[] = [
  {
    id: "google/gemma-3-12b-it:free",
    name: "Gemma 3 12B",
    provider: "Google",
    description: "Highly capable reasoning model by Google.",
  },
  {
    id: "arcee-ai/trinity-large-preview:free",
    name: "Trinity Large",
    provider: "Arcee AI",
    description: "Advanced reasoning model.",
  },
];

interface ModelDropdownProps {
  currentModel: ModelTier;
  onModelChange: (model: ModelTier) => void;
}

export const ModelDropdown: React.FC<ModelDropdownProps> = ({
  currentModel,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeModel =
    FREE_MODELS.find((m) => m.id === currentModel) || FREE_MODELS[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex flex-col items-start px-1">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold mb-[1px]">
            {activeModel.provider}
          </span>
          <span className="text-sm font-medium text-zinc-100 group-hover:text-white transition-colors">
            {activeModel.name}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-72 bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
            role="listbox"
          >
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Free Models
              </div>
              {FREE_MODELS.map((model) => {
                const isActive = activeModel.id === model.id;
                return (
                  <li key={model.id} role="option" aria-selected={isActive}>
                    <button
                      onClick={() => {
                        onModelChange(model.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl transition-all duration-200 flex flex-col gap-0.5 outline-none
                        ${
                          isActive
                            ? "bg-emerald-500/10 border border-emerald-500/20"
                            : "hover:bg-zinc-800/80 border border-transparent"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${isActive ? "text-emerald-400" : "text-zinc-200"}`}
                        >
                          {model.name}
                        </span>
                        {isActive && (
                          <motion.span
                            layoutId="activeModelDot"
                            className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                          />
                        )}
                      </div>
                      <span className="text-xs text-zinc-500 line-clamp-1">
                        {model.description}
                      </span>
                    </button>
                  </li>
                );
              })}
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};
