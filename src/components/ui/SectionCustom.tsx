import React from "react";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  color?: "blue" | "yellow" | "green";
}

const colorMap = {
  blue: "bg-blue-500",
  yellow: "bg-amber-500",
  green: "bg-green-500",
};

const Section: React.FC<SectionProps> = ({
  title,
  children,
  action,
  color = "blue",
}) => {
  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-3 text-[var(--text-main)]">
          
          {/* 🔥 BARRA DE COLOR */}
          <div className={`w-2 h-6 rounded-full ${colorMap[color]}`}></div>

          {title}
        </h3>

        {action && <div>{action}</div>}
      </div>

      {children}
    </div>
  );
};

export default Section;