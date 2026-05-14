import React from "react";

interface ActaSubNavbarProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  actions?: React.ReactNode;
}

const ActaSubNavbar: React.FC<ActaSubNavbarProps> = ({
  title,
  subtitle,
  onBack,
  actions,
}) => {
  return (
    <div
      className="
        flex flex-col md:flex-row
        justify-between items-center
        gap-6 mb-10 mt-10 no-print

        rounded-[2.5rem]
        p-8

        bg-[var(--bg-card)]
        border
        border-[var(--border-color)]

        shadow-sm
      "
    >
      <div>
        <button
          onClick={onBack}
          className="
            text-[10px]
            font-black
            mb-2
            flex items-center gap-1
            uppercase tracking-widest

            text-[var(--primary)]
            hover:opacity-80
            transition-all
          "
        >
          ← Corregir Datos
        </button>

        <h2
          className="
            text-2xl
            font-black
            tracking-tight
            leading-none

            text-[var(--text-main)]
          "
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="
              text-xs
              mt-2
              text-[var(--text-muted)]
            "
          >
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {actions}
      </div>
    </div>
  );
};

export default ActaSubNavbar;