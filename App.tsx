import React, { useState, useEffect, useRef } from 'react';
import { ActaData, View} from './types';
import { INITIAL_ACTA_DATA } from './constants';
import { backendService } from './src/services/api';
import Navbar from './src/components/layout/Navbar';
import DashboardPage from './src/pages/DashboardPage';
import CreateActaPage from './src/pages/CreateActaPage';
import ActaPreview from './src/components/actas/ActaPreview';
import { Printer, FileUp } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [history, setHistory] = useState<ActaData[]>([]);
  const [currentActa, setCurrentActa] = useState<ActaData>(INITIAL_ACTA_DATA);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('cem_theme');
    return (saved as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const saved = localStorage.getItem('cem_actas_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cem_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const saveToHistory = (acta: ActaData) => {
    const exists = history.find(h => h.id === acta.id);
    let updated;
    if (exists) {
      updated = history.map(h => h.id === acta.id ? acta : h);
    } else {
      updated = [acta, ...history];
    }
    setHistory(updated);
    localStorage.setItem('cem_actas_history', JSON.stringify(updated));
  };

  const handleStartNew = async () => {
    const nextNumber = await backendService.getNextActaNumber();
    setCurrentActa({
      ...INITIAL_ACTA_DATA,
      id: crypto.randomUUID(),
      actaNumber: nextNumber,
      status: 'pending_scan'
    });
    setView('create');
  };

  const handlePrint = () => {
    window.print();
    saveToHistory(currentActa);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingForId) return;

    setIsUploading(true);
    const targetActa = history.find(h => h.id === uploadingForId) || currentActa;
    
    const result = await backendService.saveActa(targetActa, file);
    
    if (result.success) {
      const finalized: ActaData = { 
        ...targetActa, 
        status: 'uploaded', 
        driveFileId: result.driveId,
        scannedFileName: file.name
      };
      saveToHistory(finalized);
      alert(`Acta #${targetActa.actaNumber} escaneada y subida con éxito a Drive.`);
      if (view !== 'dashboard') setView('dashboard');
    }
    setIsUploading(false);
    setUploadingForId(null);
  };

  const triggerUpload = (actaId: string) => {
    setUploadingForId(actaId);
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />

      <Navbar 
        view={view}
        theme={theme}
        toggleTheme={toggleTheme}
        onDashboard={() => setView('dashboard')}
        onNewActa={handleStartNew}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {view === 'dashboard' && (
          <DashboardPage 
            history={history}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isUploading={isUploading}
            uploadingForId={uploadingForId}
            onStartNew={handleStartNew}
            onTriggerUpload={triggerUpload}
            onViewActa={(acta) => { setCurrentActa(acta); setView('preview'); }}
          />
        )}

        {view === 'create' && (
          <CreateActaPage 
            acta={currentActa}
            setActa={setCurrentActa}
            onPreview={() => setView('preview')}
            onCancel={() => setView('dashboard')}
          />
        )}

        {view === 'preview' && (
          <div className="animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 no-print gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
              <div>
                <button onClick={() => setView('create')} className="text-blue-600 dark:text-blue-400 text-[10px] font-black mb-1 flex items-center gap-1 uppercase tracking-widest">← Corregir Datos</button>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Formato Listo para Imprimir</h2>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Imprime este documento, solicita las firmas y cárgalo al sistema.</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handlePrint}
                  className="bg-white dark:bg-slate-800 border-2 border-gray-900 dark:border-slate-700 text-gray-900 dark:text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 font-black text-sm hover:bg-gray-50 hover:text-blue-600 transition-all"
                >
                  <Printer className="w-4 h-4" /> Imprimir Acta
                </button>
                <button 
                  onClick={() => triggerUpload(currentActa.id)}
                  className="bg-[#003876] dark:bg-blue-600 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-black text-sm hover:scale-105 transition-all shadow-lg"
                >
                  <FileUp className="w-5 h-5" /> Ya tengo el Escaneo
                </button>
              </div>
            </div>
            
            <div className="print-area bg-white shadow-2xl dark:shadow-blue-500/5 rounded-sm p-4 ring-1 ring-gray-200 dark:ring-slate-800 mb-20 overflow-auto">
              <ActaPreview data={currentActa} />
            </div>
          </div>
        )}

      </main>

      {view === 'dashboard' && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#003876] dark:bg-slate-900 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-10 z-50 no-print border-4 border-white/10 dark:border-slate-800 backdrop-blur-xl transition-all">
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1 opacity-60">Registros</span>
            <span className="font-black text-2xl leading-none">{history.length}</span>
          </div>
          <div className="w-px h-10 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-green-300 uppercase tracking-widest mb-1 opacity-60">En la Nube</span>
            <span className="font-black text-2xl leading-none text-green-400">{history.filter(h => h.status === 'uploaded').length}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

// // src/App.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { ActaData } from './types';
// import { INITIAL_ACTA_DATA, ACCESORIOS_DISPONIBLES } from './constants';
// import ActaPreview from './src/components/actas/ActaPreview';
// import { backendService } from './src/services/api';
// import { 
//   FileText, 
//   Plus, 
//   Printer, 
//   Upload, 
//   Search, 
//   CheckCircle2, 
//   BrainCircuit,
//   History,
//   LayoutDashboard,
//   Loader2,
//   Moon,
//   Sun,
//   FileUp,
//   Clock,
//   Check
// } from 'lucide-react';

// const App: React.FC = () => {
//   const [view, setView] = useState<'dashboard' | 'create' | 'preview'>('dashboard');
//   const [history, setHistory] = useState<ActaData[]>([]);
//   const [currentActa, setCurrentActa] = useState<ActaData>(INITIAL_ACTA_DATA);
//   const [isAIThinking, setIsAIThinking] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  
//   // Theme state
//   const [theme, setTheme] = useState<'light' | 'dark'>(() => {
//     const saved = localStorage.getItem('cem_theme');
//     return (saved as 'light' | 'dark') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
//   });

//   useEffect(() => {
//     const saved = localStorage.getItem('cem_actas_history');
//     if (saved) setHistory(JSON.parse(saved));
//   }, []);

//   useEffect(() => {
//     if (theme === 'dark') {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//     localStorage.setItem('cem_theme', theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

//   const saveToHistory = (acta: ActaData) => {
//     const exists = history.find(h => h.id === acta.id);
//     let updated;
//     if (exists) {
//       updated = history.map(h => h.id === acta.id ? acta : h);
//     } else {
//       updated = [acta, ...history];
//     }
//     setHistory(updated);
//     localStorage.setItem('cem_actas_history', JSON.stringify(updated));
//   };

//   const handleStartNew = async () => {
//     const nextNumber = await backendService.getNextActaNumber();
//     setCurrentActa({
//       ...INITIAL_ACTA_DATA,
//       id: crypto.randomUUID(),
//       actaNumber: nextNumber,
//       status: 'pending_scan'
//     });
//     setView('create');
//   };

//   const handlePrint = () => {
//     window.print();
//     saveToHistory(currentActa);
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file || !uploadingForId) return;

//     setIsUploading(true);
//     const targetActa = history.find(h => h.id === uploadingForId) || currentActa;
    
//     const result = await backendService.saveActa(targetActa, file);
    
//     if (result.success) {
//       const finalized: ActaData = { 
//         ...targetActa, 
//         status: 'uploaded', 
//         driveFileId: result.driveId,
//         scannedFileName: file.name
//       };
//       saveToHistory(finalized);
//       alert(`Acta #${targetActa.actaNumber} escaneada y subida con éxito a Drive.`);
//       if (view !== 'dashboard') setView('dashboard');
//     }
//     setIsUploading(false);
//     setUploadingForId(null);
//   };

//   const triggerUpload = (actaId: string) => {
//     setUploadingForId(actaId);
//     fileInputRef.current?.click();
//   };

//   const toggleAccessory = (acc: string) => {
//     const currentList = currentActa.accesorios ? currentActa.accesorios.split(', ') : [];
//     let newList;
//     if (currentList.includes(acc)) {
//       newList = currentList.filter(item => item !== acc);
//     } else {
//       newList = [...currentList, acc];
//     }
//     setCurrentActa({ ...currentActa, accesorios: newList.join(', ') });
//   };

//   const filteredHistory = history.filter(h => 
//     h.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     h.actaNumber.includes(searchTerm)
//   );

//   return (
//     <div className="min-h-screen pb-20 bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
//       <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />

//       <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 no-print shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16 items-center">
//             <div className="flex items-center gap-4">
//               <div className="bg-[#003876] p-2.5 rounded-xl shadow-inner">
//                 <FileText className="text-white w-6 h-6" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-black text-[#003876] dark:text-blue-400 tracking-tighter">CEM <span className="text-blue-500 font-light">PRO</span></h1>
//                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] leading-none">Gestión de Actas</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button 
//                 onClick={toggleTheme}
//                 className="p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-yellow-400 hover:scale-105 transition-all border border-transparent dark:border-slate-700"
//               >
//                 {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
//               </button>
              
//               <button 
//                 onClick={() => setView('dashboard')}
//                 className={`p-2.5 rounded-xl transition-all ${view === 'dashboard' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
//               >
//                 <LayoutDashboard className="w-5 h-5" />
//               </button>
//               <button 
//                 onClick={handleStartNew}
//                 className="bg-[#003876] hover:bg-[#002a5a] dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-md active:scale-95"
//               >
//                 <Plus className="w-4 h-4" /> Nueva Acta
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
//         {view === 'dashboard' && (
//           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 no-print">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
//               <div>
//                 <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Archivo de Actas</h2>
//                 <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Control de entregas y digitalización de documentos firmados.</p>
//               </div>
//               <div className="relative group">
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
//                 <input 
//                   type="text" 
//                   placeholder="Buscar por nombre o #..." 
//                   className="pl-12 pr-6 py-3 border-2 border-transparent bg-white dark:bg-slate-900 dark:text-white shadow-sm rounded-2xl focus:border-blue-500 focus:ring-0 outline-none w-full md:w-80 text-sm transition-all"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>

//             {filteredHistory.length === 0 ? (
//               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-800 p-24 text-center">
//                 <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
//                   <FileText className="text-blue-200 dark:text-blue-800 w-10 h-10" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sin registros activos</h3>
//                 <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-sm">Empieza creando una nueva acta para imprimir y firmar físicamente.</p>
//                 <button 
//                   onClick={handleStartNew} 
//                   className="bg-[#003876] text-white px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
//                 >
//                   Crear Primera Acta
//                 </button>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {filteredHistory.map((acta) => (
//                   <div key={acta.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all p-7 relative group flex flex-col">
//                     <div className="absolute top-0 right-0 p-5">
//                       {acta.status === 'uploaded' ? (
//                         <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl" title="Subido a Drive">
//                           <CheckCircle2 className="text-green-600 dark:text-green-400 w-5 h-5" />
//                         </div>
//                       ) : (
//                         <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl" title="Pendiente de Escaneo">
//                           <Clock className="text-amber-600 dark:text-amber-400 w-5 h-5 animate-pulse" />
//                         </div>
//                       )}
//                     </div>
                    
//                     <div className="flex items-start gap-4 mb-6">
//                       <div className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-black text-sm px-4 py-2 rounded-2xl">
//                         #{acta.actaNumber}
//                       </div>
//                       <div className="flex-1 min-w-0 pr-8">
//                         <h4 className="font-bold text-gray-900 dark:text-white truncate uppercase tracking-tight">{acta.nombre || 'Personal'}</h4>
//                         <p className="text-xs text-gray-400 dark:text-slate-500 font-bold">{acta.fecha}</p>
//                       </div>
//                     </div>

//                     <div className="flex-1 grid grid-cols-1 gap-4 mb-8">
//                       <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800/50">
//                         <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Equipo / Activo</span>
//                         <span className="block text-sm text-gray-800 dark:text-slate-100 font-bold">{acta.equipo || 'No especificado'}</span>
//                       </div>
//                     </div>

//                     <div className="flex flex-col gap-3">
//                       {acta.status !== 'uploaded' ? (
//                         <button 
//                           onClick={() => triggerUpload(acta.id)}
//                           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
//                         >
//                           {isUploading && uploadingForId === acta.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
//                           Subir Escaneado Firmado
//                         </button>
//                       ) : (
//                         <div className="w-full bg-gray-50 dark:bg-slate-800/50 text-green-600 dark:text-green-400 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-green-100 dark:border-green-900/30">
//                           <CheckCircle2 className="w-4 h-4" /> Documento en Drive
//                         </div>
//                       )}
                      
//                       <button 
//                         onClick={() => { setCurrentActa(acta); setView('preview'); }}
//                         className="w-full bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-750 transition-all"
//                       >
//                         Ver Formato / Re-imprimir
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {view === 'create' && (
//           <div className="animate-in fade-in slide-in-from-right-4 duration-500 no-print max-w-4xl mx-auto">
//             <div className="mb-10 flex items-end justify-between">
//               <div>
//                 <button onClick={() => setView('dashboard')} className="text-gray-400 text-xs font-black mb-3 flex items-center gap-1 uppercase hover:text-blue-600 tracking-widest transition-colors">← Volver</button>
//                 <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Crear Acta</h2>
//                 <p className="text-gray-500 dark:text-slate-400 font-medium">Prepara el formato para impresión y firma física.</p>
//               </div>
//               <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 text-center ring-1 ring-gray-100 dark:ring-slate-800">
//                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Acta No.</span>
//                 <div className="text-3xl font-black text-[#003876] dark:text-blue-400">S{currentActa.actaNumber}</div>
//               </div>
//             </div>

//             <div className="space-y-8">
//               <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
//                   <div className="w-2 h-6 bg-blue-500 rounded-full"></div> 
//                   Datos del Destinatario
//                 </h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Completo</label>
//                     <input 
//                       type="text" 
//                       className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none transition-all shadow-inner"
//                       value={currentActa.nombre}
//                       onChange={e => setCurrentActa({...currentActa, nombre: e.target.value})}
//                       placeholder="Ej: CARLOS MARTINEZ"
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Cédula (CC)</label>
//                     <input 
//                       type="text" 
//                       className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
//                       value={currentActa.recibidoPorCC}
//                       onChange={e => setCurrentActa({...currentActa, recibidoPorCC: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Cargo / Posición</label>
//                     <input 
//                       type="text" 
//                       className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
//                       value={currentActa.cargo}
//                       onChange={e => setCurrentActa({...currentActa, cargo: e.target.value})}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Sede Destino</label>
//                     <select 
//                       className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
//                       value={currentActa.sede}
//                       onChange={e => setCurrentActa({...currentActa, sede: e.target.value})}
//                     >
//                       <option value="">Seleccionar...</option>
//                       <option value="SEDES CASA-CAMPESTRE">CASA-CAMPESTRE</option>
//                       <option value="SEDE PRINCIPAL">SEDE PRINCIPAL</option>
//                       <option value="SEDE ADMINISTRATIVA">SEDE ADMINISTRATIVA</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="mt-12 pt-12 border-t border-gray-50 dark:border-slate-800">
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
//                     <div className="w-2 h-6 bg-amber-500 rounded-full"></div> 
//                     Información Técnica
//                   </h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                     <div className="space-y-2">
//                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Equipo / Modelo</label>
//                       <input 
//                         type="text" 
//                         className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none shadow-inner"
//                         value={currentActa.equipo}
//                         onChange={e => setCurrentActa({...currentActa, equipo: e.target.value})}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Marca / No. Serial</label>
//                       <input 
//                         type="text" 
//                         className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
//                         value={currentActa.marca}
//                         onChange={e => setCurrentActa({...currentActa, marca: e.target.value})}
//                       />
//                     </div>
                    
//                     {/* ACCESORIOS SELECTION FIELD */}
//                     <div className="md:col-span-2 space-y-3">
//                       <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Accesorios Incluidos</label>
//                       <div className="flex flex-wrap gap-3">
//                         {ACCESORIOS_DISPONIBLES.map(acc => {
//                           const isSelected = currentActa.accesorios?.split(', ').includes(acc);
//                           return (
//                             <button
//                               key={acc}
//                               onClick={() => toggleAccessory(acc)}
//                               className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border-2 ${
//                                 isSelected 
//                                 ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
//                                 : 'bg-gray-50 dark:bg-slate-800 border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700'
//                               }`}
//                             >
//                               {isSelected && <Check className="w-4 h-4" />}
//                               {acc}
//                             </button>
//                           );
//                         })}
//                       </div>
//                       {currentActa.accesorios && (
//                         <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
//                           Seleccionados: {currentActa.accesorios}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-12 pt-12 border-t border-gray-50 dark:border-slate-800">
//                   <div className="flex justify-between items-center mb-6">
//                     <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">Observaciones Técnicas</h3>
//                     <button 
//                       onClick={/*handleSmartAI*/ () => {}}
//                       disabled={isAIThinking || !currentActa.observaciones}
//                       className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all"
//                     >
//                       {isAIThinking ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
//                       Redactar con IA
//                     </button>
//                   </div>
//                   <textarea 
//                     className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-[2.5rem] px-8 py-7 text-sm font-medium outline-none min-h-[160px] shadow-inner"
//                     placeholder="Escribe el estado del equipo aquí..."
//                     value={currentActa.observaciones}
//                     onChange={e => setCurrentActa({...currentActa, observaciones: e.target.value})}
//                   />
//                 </div>

//                 <div className="mt-12 pt-12 border-t border-gray-50 dark:border-slate-800">
//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Responsable de Entrega</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                      <div className="space-y-2">
//                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Emisor</label>
//                         <input 
//                           type="text" 
//                           className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none shadow-inner"
//                           value={currentActa.entregadoPorNombre}
//                           onChange={e => setCurrentActa({...currentActa, entregadoPorNombre: e.target.value})}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">CC Emisor</label>
//                         <input 
//                           type="text" 
//                           className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"
//                           value={currentActa.entregadoPorCC}
//                           onChange={e => setCurrentActa({...currentActa, entregadoPorCC: e.target.value})}
//                         />
//                       </div>
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 onClick={() => setView('preview')}
//                 className="w-full bg-[#003876] dark:bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl hover:bg-[#002a5a] dark:hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 dark:shadow-none"
//               >
//                 Previsualizar Formato de Impresión
//               </button>
//             </div>
//           </div>
//         )}

//         {view === 'preview' && (
//           <div className="animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
//             <div className="flex flex-col md:flex-row justify-between items-center mb-10 no-print gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm">
//               <div>
//                 <button onClick={() => setView('create')} className="text-blue-600 dark:text-blue-400 text-[10px] font-black mb-1 flex items-center gap-1 uppercase tracking-widest">← Corregir Datos</button>
//                 <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none">Formato Listo para Imprimir</h2>
//                 <p className="text-xs text-gray-500 dark:text-slate-400 mt-2">Imprime este documento, solicita las firmas y cárgalo al sistema.</p>
//               </div>
//               <div className="flex gap-4">
//                 <button 
//                   onClick={handlePrint}
//                   className="bg-white dark:bg-slate-800 border-2 border-gray-900 dark:border-slate-700 text-gray-900 dark:text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 font-black text-sm hover:bg-gray-50 transition-all"
//                 >
//                   <Printer className="w-4 h-4" /> Imprimir Acta
//                 </button>
//                 <button 
//                   onClick={() => triggerUpload(currentActa.id)}
//                   className="bg-[#003876] dark:bg-blue-600 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-black text-sm hover:scale-105 transition-all shadow-lg"
//                 >
//                   <FileUp className="w-5 h-5" /> Ya tengo el Escaneo
//                 </button>
//               </div>
//             </div>
            
//             <div className="print-area bg-white shadow-2xl dark:shadow-blue-500/5 rounded-sm p-4 ring-1 ring-gray-200 dark:ring-slate-800 mb-20 overflow-auto">
//               <ActaPreview data={currentActa} />
//             </div>
//           </div>
//         )}

//       </main>

//       {view === 'dashboard' && (
//         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#003876] dark:bg-slate-900 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-10 z-50 no-print border-4 border-white/10 dark:border-slate-800 backdrop-blur-xl transition-all">
//           <div className="flex flex-col items-center">
//             <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest mb-1 opacity-60">Registros</span>
//             <span className="font-black text-2xl leading-none">{history.length}</span>
//           </div>
//           <div className="w-px h-10 bg-white/10"></div>
//           <div className="flex flex-col items-center">
//             <span className="text-[9px] font-black text-green-300 uppercase tracking-widest mb-1 opacity-60">En la Nube</span>
//             <span className="font-black text-2xl leading-none text-green-400">{history.filter(h => h.status === 'uploaded').length}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
