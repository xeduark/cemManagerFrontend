import React from "react";
import SignaturePad from "./SignaturePad";


interface SignatureModalProps {
  open: boolean;
  title: string;
  label: string;
  onClose: () => void;
  onSave: (firma: string) => void;
  onClear: () => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  open,
  title,
  label,
  onClose,
  onSave,
  onClear,
}) => {
  if (!open) return null;

  return (
    
    <div
     className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          w-full max-w-2xl rounded-[2rem] border shadow-2xl
          transition-all duration-300
        "
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-color)",
          color: "var(--text-main)",
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-start justify-between p-6 border-b"
          style={{
            borderColor: "var(--border-color)",
          }}
        >
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              {title}
            </h3>

            <p
              className="text-sm mt-1"
              style={{
                color: "var(--text-muted)",
              }}
            >
              Realice la firma digital en el recuadro.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              w-10 h-10 rounded-full flex items-center justify-center
              text-xl font-bold transition-all
              hover:scale-110
            "
            style={{
              background: "var(--bg-soft)",
              color: "var(--text-muted)",
            }}
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          <SignaturePad
            label={label}
            onSave={onSave}
            onClear={onClear}
          />
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;