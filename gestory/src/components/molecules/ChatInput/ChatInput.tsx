import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../atoms/Input";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className="p-4 bg-white border-t border-slate-50">
      <form onSubmit={onSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Tanya Gestory AI..."
          className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-full text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        <button
          type="submit"
          disabled={!input.trim()}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-sm border border-slate-50 rounded-full flex items-center justify-center text-blue-500 hover:text-blue-600 active:scale-90 transition-all disabled:opacity-30 disabled:scale-100"
        >
          <div className="w-1.5 h-1.5 rounded-full border-2 border-slate-200" />
        </button>
      </form>
    </div>
  );
};
