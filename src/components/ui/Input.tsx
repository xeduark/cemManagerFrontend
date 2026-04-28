import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ 
    label, 
    className = "",
     ...props 
    }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[11px] font-black uppercase tracking-widest ml-1 text-[var(--text-muted)]">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`input-field w-full px-5 py-4 text-sm font-bold outline-none shadow-inner focus:border-blue-500 ${className}`}
      />
    </div>
  );
};

export default Input;