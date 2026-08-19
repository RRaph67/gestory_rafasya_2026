"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ChatWindowMessage } from "../../molecules/ChatMessage";
import { ChatToggleButton } from "../../atoms/Button";
import { ChatInput } from "../../molecules/ChatInput";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  role?: string;
}

export const ChatWidget = () => {
  // ── 1. Hooks (Must always be called in the same order) ────
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Saya Gestory AI, asisten belajarmu. Ada yang bisa saya bantu hari ini?",
      sender: "ai",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── 2. Effects ──────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // ── 3. Handlers ──────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      role: "Vicent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Maaf, saat ini Gestory AI sedang dalam tahap pemeliharaan. Saya akan segera kembali untuk menemani belajarmu!",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // ── 4. Conditional Rendering (After all hooks) ───────────
  if (!isMounted) return null;
  if (pathname === "/play") return null;

  return (
    <div className="fixed bottom-6 right-6 z-100 font-sans">
      {/* ── Chat Window ────────────────────────────────────────── */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[340px] md:w-[360px] h-[480px] md:h-[520px] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in duration-300">
          {/* Header */}
          <ChatWindowHeader onClose={() => setIsOpen(false)} />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50 space-y-5 scrollbar-hide">
            {messages.map((msg) => (
              <ChatWindowMessage key={msg.id} message={msg} />
            ))}

            {/* Typing Indicator */}
            {isTyping && <ChatTypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <ChatInput
            input={input}
            onInputChange={setInput}
            onSubmit={handleSend}
          />
        </div>
      )}

      {/* ── Toggle Button ─────────────────────────────────────── */}
      <ChatToggleButton isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// Sub-components
// ════════════════════════════════════════════════════════════════════

interface ChatWindowHeaderProps {
  onClose: () => void;
}

const ChatWindowHeader: React.FC<ChatWindowHeaderProps> = ({ onClose }) => {
  const { RefreshCcw, X } = require("lucide-react");

  return (
    <div className="bg-white border-b border-slate-50 px-5 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <button className="text-slate-300 hover:text-blue-500 transition-colors">
          <RefreshCcw className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-slate-800 text-base">Gestory AI</h3>
      </div>
      <button
        onClick={onClose}
        className="text-slate-300 hover:text-red-500 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

const ChatTypingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-2.5">
        <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-slate-100 shadow-sm">
          <img
            src="/assets/gestory_thinking.png"
            alt="Gestory"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
          <span className="text-slate-400 text-[10px] font-bold italic">
            Sedang berpikir...
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
            <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
};
