"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { UserModel, ChatSessionMeta } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: UserModel;
  onNewChat?: () => void;
  sessions?: ChatSessionMeta[];
  activeSessionId?: string | null;
  onSelectSession?: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  user,
  onNewChat,
  sessions = [],
  activeSessionId,
  onSelectSession,
}) => {
  // Variants for the sidebar animation
  const sidebarVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
  };

  // Group sessions by Today / Previous
  const todaySessions: ChatSessionMeta[] = [];
  const olderSessions: ChatSessionMeta[] = [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  sessions.forEach((session) => {
    const sessionDate = new Date(session.updatedAt);
    if (sessionDate >= todayStart) {
      todaySessions.push(session);
    } else {
      olderSessions.push(session);
    }
  });

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="luminous-sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-zinc-950/80 backdrop-blur-2xl border-r border-white/5 shadow-2xl overflow-hidden"
            aria-label="Sidebar Navigation"
          >
            {/* Header / New Chat */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <button
                onClick={onNewChat}
                className="flex flex-1 items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-zinc-800/50 hover:bg-zinc-700/50 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none group"
                aria-label="Start new chat"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors">
                  <span className="text-emerald-400 font-bold">+</span>
                </div>
                New Chat
              </button>

              <button
                onClick={onToggle}
                className="ml-2 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/50 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none lg:hidden"
                aria-label="Close sidebar"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Chat History Grouping */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
              {todaySessions.length > 0 && (
                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Today
                  </h3>
                  {todaySessions.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => onSelectSession && onSelectSession(s._id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none border hover:border-white/5 group
                        ${
                          activeSessionId === s._id
                            ? "text-white bg-zinc-900/80 border-white/5"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-transparent"
                        }
                      `}
                    >
                      {activeSessionId !== s._id && (
                        <span className="group-hover:text-emerald-400 transition-colors mr-2 opacity-0 group-hover:opacity-100">
                          &bull;
                        </span>
                      )}
                      {s.title}
                    </button>
                  ))}
                </div>
              )}

              {olderSessions.length > 0 && (
                <div className="space-y-1">
                  <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-6 mb-2">
                    Previous 7 Days
                  </h3>
                  {olderSessions.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => onSelectSession && onSelectSession(s._id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors truncate focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none border hover:border-white/5 group
                        ${
                          activeSessionId === s._id
                            ? "text-white bg-zinc-900/80 border-white/5"
                            : "text-zinc-400 hover:text-white hover:bg-zinc-800/40 border-transparent"
                        }
                      `}
                    >
                      {activeSessionId !== s._id && (
                        <span className="group-hover:text-emerald-400 transition-colors mr-2 opacity-0 group-hover:opacity-100">
                          &bull;
                        </span>
                      )}
                      {s.title}
                    </button>
                  ))}
                </div>
              )}

              {sessions.length === 0 && (
                <div className="px-3 py-6 text-center text-sm text-zinc-500">
                  No chat history yet
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t border-white/5 bg-zinc-900/30">
              <button
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/60 transition-colors text-left focus-visible:ring-2 focus-visible:ring-emerald-400 outline-none"
                aria-label="User settings"
              >
                <div className="relative">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.username || user.name || "User"}
                      className="w-8 h-8 rounded-full bg-zinc-800 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                      {(user.username || user.name || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-950"></span>
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-white">
                    {user.username || user.name || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    Pro Tier Active
                  </p>
                </div>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
};
