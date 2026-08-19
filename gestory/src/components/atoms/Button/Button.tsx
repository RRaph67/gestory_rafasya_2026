import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  const baseStyles = "font-medium transition-all rounded focus:outline-none focus:ring-2 active:scale-95";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-200",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-200",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface ChatToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="group relative flex items-center justify-center transition-transform active:scale-95"
    >
      <div
        className={`flex items-center gap-2.5 bg-blue-600 text-white px-5 py-2.5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <span className="text-xl font-black">Chat</span>
        <div className="relative w-12 h-12 -mt-8 -mr-5 bg-white rounded-full border-2 border-white overflow-hidden shadow-inner">
          <img
            src="/assets/gestory_happy.png"
            alt="Chat"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
      </div>

      {/* Pointer bubble tip */}
      <div
        className={`absolute -bottom-1.5 left-4 w-4 h-4 bg-blue-600 rotate-45 -z-10 transition-all ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      />
    </button>
  );
};
