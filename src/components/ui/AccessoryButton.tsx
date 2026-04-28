import React from "react";

interface Props {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

const AccessoryButton: React.FC<Props> = ({
  children,
  selected,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="accessory-btn px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border-2 transition-all"
      style={{
        background: selected ? "var(--primary)" : "var(--bg-input)",
        color: selected ? "white" : "var(--text-muted)",
      }}
    >
      {children}
    </button>
  );
};

export default AccessoryButton;