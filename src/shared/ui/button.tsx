import * as React from "react";
import { cn } from "./utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
};

function Button({ className, variant = "default", size = "default", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all";
  const variantCls =
    variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "outline"
      ? "border bg-white"
      : variant === "secondary"
      ? "bg-gray-100"
      : variant === "ghost"
      ? "bg-transparent"
      : "bg-[#8B4513] text-white hover:bg-[#5D2E1A]";
  const sizeCls = size === "sm" ? "h-8 px-3" : size === "lg" ? "h-10 px-6" : size === "icon" ? "h-9 w-9 p-0" : "h-9 px-4";

  return (
    <button data-slot="button" className={cn(base, variantCls, sizeCls, className)} {...props}>
      {children}
    </button>
  );
}

export { Button };
