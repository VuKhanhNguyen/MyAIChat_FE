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
    id: "arcee-ai/trinity-large-preview:free",
    name: "Trinity Large",
    provider: "Arcee AI",
    description: "Highly capable reasoning model by Arcee AI.",
  },
  {
    id: "stepfun/step-3.5-flash:free",
    name: "Step 3.5 Flash",
    provider: "StepFun",
    description: "Fast and efficient reasoning model by StepFun.",
  },
  {
    id: "z-ai/glm-4.5-air:free",
    name: "GLM 4.5 Air",
    provider: "Z-AI",
    description: "Fast and efficient reasoning model by Z-AI.",
  },
  {
    id: "nvidia/nemotron-3-nano-30b-a3b:free",
    name: "Nemotron 3 Nano",
    provider: "NVIDIA",
    description: "Fast and efficient reasoning model by NVIDIA.",
  },
];

interface ModelDropdownProps {
  currentModel: ModelTier;
  onModelChange: (model: ModelTier) => void;
  rateLimitRemaining?: number | null;
}

export const ModelDropdown: React.FC<ModelDropdownProps> = ({
  currentModel,
  onModelChange,
  rateLimitRemaining,
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
        className="flex items-center gap-3 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 group"
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

        {rateLimitRemaining !== undefined && rateLimitRemaining !== null && (
          <div className="flex items-center gap-1.5 pl-2 ml-2 border-l border-white/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-xs font-semibold text-amber-500/90 hidden sm:block">
              {rateLimitRemaining} Left
            </span>
          </div>
        )}

        <svg
          className={`w-4 h-4 ml-2 text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
