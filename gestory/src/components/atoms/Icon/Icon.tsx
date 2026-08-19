import React from "react";
import * as Icons from "lucide-react";

interface IconProps {
  name: keyof typeof Icons;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = "",
  strokeWidth = 2,
}) => {
  const IconComponent = Icons[name] as React.FC<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;

  if (!IconComponent) {
    console.warn(`Icon ${name} not found in lucide-react`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
};
