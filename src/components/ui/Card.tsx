import React from "react";

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      className="p-10 rounded-[2.5rem] shadow-sm border"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {children}
    </div>
  );
};

export default Card;