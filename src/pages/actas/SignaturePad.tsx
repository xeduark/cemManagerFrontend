import React, { useRef, forwardRef, useImperativeHandle } from "react";

// ==========================================
// TYPES
// ==========================================

interface SignaturePadProps {
  label: string;
  onSave: (signatureData: string) => void;
  onClear: () => void;
}

export interface SignaturePadRef {
  getSignature: () => string | null;
  clear: () => void;
}

// ==========================================
// COMPONENT
// ==========================================

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ label, onSave, onClear }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const isDrawing = useRef(false);

    const hasSigned = useRef(false);

    // ==========================================
    // START DRAW
    // ==========================================

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      isDrawing.current = true;

      const canvas = canvasRef.current;

      const ctx = canvas?.getContext("2d");

      if (!ctx || !canvas) return;

      const rect = canvas.getBoundingClientRect();

      const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;

      const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

      ctx.beginPath();

      ctx.moveTo(x, y);
    };

    // ==========================================
    // STOP DRAW
    // ==========================================

    const stopDrawing = () => {
      isDrawing.current = false;
    };

    // ==========================================
    // DRAW
    // ==========================================

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing.current || !canvasRef.current) {
        return;
      }

      const canvas = canvasRef.current;

      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();

      const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;

      const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

      ctx.lineWidth = 2;

      ctx.lineCap = "round";

      ctx.strokeStyle = "#000";

      ctx.lineTo(x, y);

      ctx.stroke();

      hasSigned.current = true;
    };

    // ==========================================
    // CLEAR
    // ==========================================

    const handleClear = () => {
      const canvas = canvasRef.current;

      const ctx = canvas?.getContext("2d");

      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hasSigned.current = false;

        onClear();
      }
    };

    // ==========================================
    // SAVE
    // ==========================================

    const handleSave = () => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      if (!hasSigned.current) {
        alert("Debe realizar una firma antes de confirmar.");
        return;
      }

      onSave(canvas.toDataURL("image/png"));

      alert("Firma confirmada correctamente");
    };

    // ==========================================
    // EXPOSE METHODS
    // ==========================================

    useImperativeHandle(ref, () => ({
      getSignature: () => {
        const canvas = canvasRef.current;

        if (!canvas || !hasSigned.current) {
          return null;
        }

        return canvas.toDataURL("image/png");
      },

      clear: handleClear,
    }));

    // ==========================================
    // RENDER
    // ==========================================

    return (
      <div className="flex flex-col items-center p-4 border dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/50 shadow-sm">
        <p className="text-xs font-bold mb-3 text-gray-500 dark:text-slate-400 uppercase tracking-widest">
          {label}
        </p>

        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl cursor-crosshair bg-white touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleClear}
            className="theme-btn px-4 py-2 text-xs rounded-xl"
          >
            Limpiar
          </button>

          <button
            onClick={handleSave}
            className="btn-preview px-4 py-2 text-xs rounded-xl"
          >
            Confirmar Firma
          </button>
        </div>
      </div>
    );
  },
);

export default SignaturePad;
