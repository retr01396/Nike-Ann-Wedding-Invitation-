import React from "react";
import clsx from "clsx";

interface GoldTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "subtle" | "bright" | "solid";
  glow?: boolean;
  as?: React.ElementType;
}

export const GoldText: React.FC<GoldTextProps> = ({
  children,
  className,
  variant = "primary",
  glow = false,
  as: Component = "span",
}) => {
  const getGradient = () => {
    switch (variant) {
      case "subtle":
        return "gold-foil-text-subtle";
      case "bright":
        return "gold-foil-text";
      case "solid":
        return "text-gold-300";
      case "primary":
      default:
        return "gold-foil-text";
    }
  };

  return (
    <Component
      className={clsx(
        "inline-block font-serif tracking-wider",
        getGradient(),
        glow && "drop-shadow-[0_0_15px_rgba(229,197,123,0.35)]",
        className
      )}
    >
      {children}
    </Component>
  );
};
