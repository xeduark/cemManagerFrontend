import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
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

      <textarea
        {...props}
        className={`input-field w-full px-5 py-4 text-sm font-medium outline-none min-h-[120px] ${className}`}
      />
    </div>
  );
};

export default TextArea;