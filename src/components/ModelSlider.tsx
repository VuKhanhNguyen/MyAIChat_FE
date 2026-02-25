"use client";

import React from "react";
import { motion } from "framer-motion";
import type { ModelTier } from "../types";

interface ModelSliderProps {
  currentModel: ModelTier;
  onModelChange: (model: ModelTier) => void;
}

export const ModelSlider: React.FC<ModelSliderProps> = ({
  currentModel,
  onModelChange,
}) => {
  const models: { id: ModelTier; label: string; description: string }[] = [
    {
      id: "fast",
      label: "Fast",
      description: "Lowest latency, good for everyday tasks.",
    },
    {
      id: "pro",
      label: "Pro",
      description: "High reasoning, optimized for complex coding.",
    },
    {
      id: "ultra",
      label: "Ultra",
      description: "Maximum capabilities, longest context.",
    },
  ];

  return (
    <div
      className="relative flex items-center p-1 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-full overflow-hidden"
      role="radiogroup"
      aria-orientation="horizontal"
      aria-label="Select AI Model"
    >
      {models.map((model) => {
        const isActive = currentModel === model.id;

        return (
          <button
            key={model.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`Select ${model.label} model`}
            title={model.description}
            style={{ WebkitTapHighlightColor: "transparent" }}
            className={`
              relative z-10 px-5 py-2 text-sm font-medium transition-colors duration-300 outline-none
              flex-1 text-center 
              focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
              ${isActive ? "text-emerald-50" : "text-zinc-500 hover:text-zinc-300"}
            `}
            onClick={() => onModelChange(model.id)}
          >
            {/* 
              This layout Id allows Framer Motion to animate the background bounding box smoothly 
              between the active elements.
            */}
            {isActive && (
              <motion.div
                layoutId="activeModelPill"
                className="absolute inset-0 bg-emerald-900/20 border border-emerald-500/30 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
              />
            )}

            <span className="relative z-20 flex items-center justify-center gap-2">
              {model.label}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
