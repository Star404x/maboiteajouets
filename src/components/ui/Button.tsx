"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-semibold rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/30 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-coral text-white shadow-pop hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 btn-shine",
        secondary:
          "bg-white text-navy border-2 border-navy/10 hover:border-coral hover:text-coral shadow-soft",
        ghost:
          "bg-transparent text-navy hover:bg-navy/5",
        dark:
          "bg-navy text-white hover:bg-navy-700 shadow-card",
        outline:
          "bg-transparent border-2 border-white text-white hover:bg-white hover:text-navy",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
