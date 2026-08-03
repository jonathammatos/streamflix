import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer";

  const variants = {
    primary:
      "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 active:bg-zinc-900",
    outline: "border border-zinc-600 text-white hover:bg-zinc-800",
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
