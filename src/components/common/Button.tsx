import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer";

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30",
    secondary: "bg-zinc-800/80 hover:bg-zinc-700 text-white backdrop-blur-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
