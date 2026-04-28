import React from "react";

type Variant = "primary" | "success" | "secondary";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  let styles = "";

  switch (variant) {
    case "success":
      styles = "btn-save text-white";
      break;
    case "secondary":
      styles = "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)]";
      break;
    default:
      styles = "btn-preview text-white";
  }

  return (
    <button
      {...props}
      className={`flex-1 py-5 rounded-[2.5rem] font-black text-lg transition-all disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;