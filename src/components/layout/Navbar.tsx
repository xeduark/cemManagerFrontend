import React from 'react';
import { FileText, Plus, LayoutDashboard, Moon, Sun } from 'lucide-react';
import { View } from '../../../types';

interface NavbarProps {
  view: View;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onDashboard: () => void;
  onNewActa: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, theme, toggleTheme, onDashboard, onNewActa }) => {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#003876] p-2.5 rounded-xl shadow-inner">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#003876] dark:text-blue-400 tracking-tighter">
                CEM <span className="text-blue-500 font-light">PRO</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none">
                Gestión de Actas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-yellow-400 hover:scale-105 transition-all border border-transparent dark:border-slate-700"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={onDashboard}
              className={`p-2.5 rounded-xl transition-all ${view === 'dashboard' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <button 
              onClick={onNewActa}
              className="bg-[#003876] hover:bg-[#002a5a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" /> Nueva Acta
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
