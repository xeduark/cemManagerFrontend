
import React, { useRef } from 'react';

//signature pad component

interface SignaturePadProps {
  label: string;
  onSave: (signatureData: string) => void;
  onClear: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ label, onSave, onClear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (canvas) {
      onSave(canvas.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    if (!isDrawing.current) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      onClear();
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-800/50 shadow-sm">
      <p className="text-xs font-bold mb-3 text-gray-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
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
      <button
        onClick={handleClear}
        className="mt-3 text-[10px] text-red-500 hover:text-red-600 font-black uppercase tracking-widest"
      >
        Limpiar Trazo
      </button>
    </div>
  );
};

export default SignaturePad;
