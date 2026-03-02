import React, { useState, useEffect } from "react";
import { ActaData } from "../../types";
import { backendService } from "../services/api";
import { getSystemUsers } from "../services/user.service";
import ActaForm from "../components/form/CreateActaForm";

interface CreateActaPageProps {
  acta: ActaData;
  setActa: (acta: ActaData) => void;
  onPreview: () => void;
  onCancel: () => void;
}

const CreateActaPage: React.FC<CreateActaPageProps> = ({
  acta,
  setActa,
  onPreview,
  onCancel,
}) => {
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleSmartAI = async () => {
    if (!acta.observaciones) return;
    setIsAIThinking(true);
    try {
      const improved = await backendService.generarActa(acta.observaciones);
      setActa({ ...acta, observaciones: improved });
    } catch (error) {
      console.error("Error improving observaciones:", error);
    } finally {
      setIsAIThinking(false);
    }
  };

  // Validación básica de campos obligatorios antes de mostrar la vista previa

    const validateForm = () => {
    const missingFields: string[] = [];
    if (!acta.nombre) missingFields.push("Nombre Completo");
    if (!acta.recibidoPorCC) missingFields.push("Cédula (CC)");
    if (!acta.cargo) missingFields.push("Cargo / Posición");
    if (!acta.sede) missingFields.push("Sede Destino");
    if (!acta.equipo) missingFields.push("Equipo / Modelo");
    if (!acta.marca) missingFields.push("Marca / No. Serial");
    if (!acta.entregadoPorNombre) missingFields.push("Entregado por (Usuario)");

    if (missingFields.length > 0) {
      alert(`Por favor complete los siguientes campos obligatorios:\n\n- ${missingFields.join("\n- ")}`);
      return false;
    }
    return true;
  };

  const handlePreview = () => {
    if (validateForm()) {
      onPreview();
    }
  };

  // Cargar usuarios del sistema al montar el componente
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getSystemUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios", error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 no-print max-w-4xl mx-auto p-4">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <button
            onClick={onCancel}
            className="text-gray-400 text-xs font-black mb-3 flex items-center gap-1 uppercase hover:text-blue-600 tracking-widest transition-colors"
          >
            ← Volver
          </button>
          <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Crear Acta
          </h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            Prepara el formato para impresión y firma física.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 text-center ring-1 ring-gray-100 dark:ring-slate-800">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
            Acta No.
          </span>
          <div className="text-3xl font-black text-[#003876] dark:text-blue-400">
            S{acta.actaNumber}
          </div>
        </div>
      </div>

      <ActaForm
        acta={acta}
        setActa={setActa}
        users={users}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        isAIThinking={isAIThinking}
        onSmartAI={handleSmartAI}
        onPreview={handlePreview}
      />
    </div>
  );
};

export default CreateActaPage;
