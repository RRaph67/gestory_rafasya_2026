import React from "react";
import { User } from "lucide-react";

interface ChatMessageProps {
  id: string;
  text: string;
  sender: "user" | "ai";
  role?: string;
}

export const ChatWindowMessage: React.FC<{ message: ChatMessageProps }> = ({
  message,
}) => {
  const { id, text, sender, role } = message;

  return (
    <div
      key={id}
      className={`flex flex-col ${sender === "user" ? "items-end" : "items-start"}`}
    >
      {sender === "user" && (
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 mr-2">
          {role}
        </span>
      )}
      <div
        className={`flex gap-2.5 max-w-[85%] ${
          sender === "user" ? "flex-row-reverse" : ""
        }`}
      >
        {/* Avatar Container */}
        <div className="w-9 h-9 rounded-full overflow-hidden bg-white border border-slate-100 shrink-0 shadow-sm">
          {sender === "ai" ? (
            <img
              src="/assets/gestory_happy.png"
              alt="Gestory"
              className="w-full h-full object-cover mix-blend-multiply"
            />
          ) : (
            <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-500">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
            sender === "user"
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white text-slate-700 rounded-tl-none"
          }`}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
