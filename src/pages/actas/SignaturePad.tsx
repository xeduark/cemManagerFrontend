import React, { useRef } from "react";

// signature pad component

interface SignaturePadProps {
  label: string;
  onSave: (signatureData: string) => void;
  onClear: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  onSave,
  onClear,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasSigned = useRef(false); // ⭐ detecta si el usuario realmente firmó

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

  const stopDrawing = () => {
    isDrawing.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    //  evitar guardar firma vacía
    if (!hasSigned.current) {
      return;
    }

    onSave(canvas.toDataURL("image/png"));
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;

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

    hasSigned.current = true; // ⭐ usuario dibujó algo
  };
  // función para limpiar el canvas y resetear el estado de firma
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSigned.current = false; //  resetear firma
      onClear();
    }
  };
  //  función para manejar el guardado de la firma, verifica que se haya dibujado algo antes de guardar
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!hasSigned.current) {
      alert("Debe realizar una firma antes de guardar.");
      return;
    }

    onSave(canvas.toDataURL("image/png"));
  };

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
    </div>
  );
};

export default SignaturePad;
