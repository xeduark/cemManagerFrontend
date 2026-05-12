import React from "react";
import { Search, FileText, Loader2 } from "lucide-react";
import { ActaData } from "../types/types";
import { actaService } from "../services/acta.service";
import ActaCard from "@/components/ui/ActaCard";
import { useState, useEffect } from "react";
interface DashboardPageProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  isUploading: boolean;
  uploadingForId: string | null;
  onStartNew: () => void;
  onTriggerUpload: (id: string) => void;
  onViewActa: (acta: ActaData) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  searchTerm,
  setSearchTerm,
  onStartNew,
  onViewActa,
}) => {
  //INICIO DE DASHBOARD PAGE

  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);

  //estados locales para manejo de actas, aunque se reciben por props, esto es para manejar estados de carga o actualizaciones locales si es necesario
  const [actas, setActas] = useState<ActaData[]>([]);
  const [loading, setLoading] = useState(true);
  //estado local para manejo de paginación, esto es para manejar estados de carga o actualizaciones locales si es necesario
  const [itemsPerPage, setItemsPerPage] = useState(10);

  //función para manejar el cambio en la cantidad de items por página, esto es para futuras implementaciones de paginación o carga incremental
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setPage(1); // Reiniciar a la primera página al cambiar el límite
  };

  //función para manejar el cambio de estado de un acta, esto es para actualizar el estado de la acta tanto en el backend como localmente sin necesidad de recargar toda la lista
  const handleEstadoChange = async (
    id: number,
    nuevoEstado: "ABIERTA" | "CERRADA",
  ) => {
    try {
      await actaService.updateEstado(id, nuevoEstado);

      // 🔥 update optimista (sin recargar)
      setActas((prev) =>
        prev.map((acta) =>
          acta.id === id ? { ...acta, estado: nuevoEstado } : acta,
        ),
      );
    } catch (error) {
      console.error("Error actualizando estado", error);
    }
  };

  useEffect(() => {
    const fetchActas = async () => {
      setLoading(true);

      try {
        const result = await actaService.getActas(
          page,
          itemsPerPage,
          searchTerm,
        );

        setActas(result.data);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActas();
  }, [page, itemsPerPage, searchTerm]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 no-print mt-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div className="content-title">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Archivo de Actas
          </h2>
          <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">
            Control de entregas y digitalización de documentos firmados.
          </p>
        </div>
        <div className="content-search-limit flex items-center gap-3 md:ml-auto">
          <div className="relative group w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por acta..."
              className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white dark:bg-slate-900 dark:text-white border border-gray-100 dark:border-slate-800 shadow-sm focus:border-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Mostrar:
            </span>

            <select
              value={itemsPerPage}
              onChange={handleLimitChange}
              className="bg-transparent text-sm font-bold text-gray-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      {loading && actas.length === 0 ? (
        // Loader inicial
        <div className="flex flex-col justify-center items-center py-20 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="text-sm text-gray-400">Cargando actas...</span>
        </div>
      ) : actas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-800 p-24 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="text-blue-200 dark:text-blue-800 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Sin registros activos
          </h3>
          <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-xs mx-auto text-sm">
            Empieza creando una nueva acta para imprimir y firmar físicamente.
          </p>
          <button
            onClick={onStartNew}
            className="bg-[#003876] text-white px-10 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all"
          >
            Crear Primera Acta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actas.map((acta) => (
            <ActaCard
              key={acta.id}
              acta={acta}
              onView={onViewActa}
            />
          ))}
        </div>
      )}
      <div className="flex justify-center gap-4 mt-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Anterior
        </button>

        <span className="text-sm font-bold">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
