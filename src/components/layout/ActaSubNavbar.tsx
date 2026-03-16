import React from "react";
import { Save } from "lucide-react";

interface ActaSubNavbarProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onSave?: () => void;
  actions?: React.ReactNode;
}

const ActaSubNavbar: React.FC<ActaSubNavbarProps> = ({
  title,
  subtitle,
  onBack,
  onSave,
  actions,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 no-print gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
      <div>
        <button
          onClick={onBack}
          className="text-blue-600 dark:text-blue-400 text-[10px] font-black mb-1 flex items-center gap-1 uppercase tracking-widest"
        >
          ← Corregir Datos
        </button>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        {actions}
        {onSave && (
          <button
            onClick={onSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-sm transition-all"
          >
            <Save className="w-4 h-4" /> Guardar
          </button>
        )}
      </div>
    </div>
  );
};

export default ActaSubNavbar;