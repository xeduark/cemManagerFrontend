import React, { useState, useEffect } from "react";
import { ActaData } from "../../types";
import { backendService } from "../services/api";
import { getSystemUsers } from "../services/user.service";
import { actaService } from "../services/acta.service";
import ActaForm from "../components/form/CreateActaForm";
import { useParams } from "react-router-dom";

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
  const { id } = useParams();
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
  const mode = id ? "edit" : "create";
  // Validación básica de campos obligatorios antes de mostrar la vista previa

  const [isLoadingActa, setIsLoadingActa] = useState(false); // Estado para controlar la carga del acta al editar
  // Función para validar los campos obligatorios del formulario

  const validateForm = () => {
    const missingFields: string[] = [];
    if (!acta.recibidoPorNombre) missingFields.push("Nombre Completo");
    if (!acta.recibidoPorCC) missingFields.push("Cédula (CC)");
    if (!acta.cargo) missingFields.push("Cargo / Posición");
    if (!acta.sede) missingFields.push("Sede Destino");
    if (!acta.equipo) missingFields.push("Equipo / Modelo");
    if (!acta.marca) missingFields.push("Marca / No. Serial");
    if (!acta.entregadoPorNombre) missingFields.push("Entregado por (Usuario)");

    const hasDiademas = acta.accesorios?.includes("DIADEMAS");

    if (hasDiademas) {
      if (!acta.diademaMarcaId) {
        missingFields.push("Marca de la Diadema");
      }

      if (!acta.diademaSerial?.trim()) {
        missingFields.push("Serial de la Diadema");
      }
    }
    if (missingFields.length > 0) {
      alert(
        `Por favor complete los siguientes campos obligatorios:\n\n- ${missingFields.join("\n- ")}`,
      );
      return false;
    }
    return true;
  };

  // Función para guardar el acta en estado "draft" antes de la vista previa o impresión

  const handleSave = async () => {
    if (isSaving) return; // Evitar múltiples clics
    if (!validateForm()) return; // Validar campos antes de guardar

    console.log("ACTA QUE SE VA A GUARDAR:", acta);

    try {
      setIsSaving(true);

      let savedActa;

      if (acta.id) {
        savedActa = await actaService.updateActa(acta.id, {
          fecha: acta.fecha,
          cargo: acta.cargo,
          sede: acta.sede,
          equipo: acta.equipo,
          marca: acta.marca,
          accesorios: acta.accesorios,
          observaciones: acta.observaciones,
          recibidoPorNombre: acta.recibidoPorNombre,
          recibidoPorCC: acta.recibidoPorCC,
          entregadoPorNombre: acta.entregadoPorNombre,
          entregadoPorCC: acta.entregadoPorCC,
          vistoBueno: acta.vistoBueno,
          status: "draft",
        });
      } else {
        //  Si no existe → crear
        savedActa = await actaService.createActa({
          fecha: acta.fecha,
          cargo: acta.cargo,
          sede: acta.sede,
          equipo: acta.equipo,
          marca: acta.marca,
          accesorios: acta.accesorios,
          observaciones: acta.observaciones,
          recibidoPorNombre: acta.recibidoPorNombre,
          recibidoPorCC: acta.recibidoPorCC,
          entregadoPorNombre: acta.entregadoPorNombre,
          entregadoPorCC: acta.entregadoPorCC,
          vistoBueno: acta.vistoBueno,
          status: "draft",
        });
      }

      console.log("Acta guardada:", savedActa);

      setActa(savedActa); // ⭐ importante para actualizar el estado

      alert("Acta guardada correctamente");
    } catch (error) {
      console.error("Error guardando acta", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Función para manejar la vista previa, primero valida el formulario y luego navega a la vista de previsualización

  const handlePreview = () => {
    onPreview();
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

  useEffect(() => {
    const loadActa = async () => {
      if (!id || id === "draft") return;

      try {
        setIsLoadingActa(true);
        const data = await actaService.getActaById(id);
        setActa(data);
      } catch (error) {
        console.error("Error cargando acta", error);
      } finally {
        setIsLoadingActa(false);
      }
    };

    loadActa();
  }, [id, setActa]);

  if (isLoadingActa) {
    return (
      <div className="p-20 text-center text-gray-500">Cargando acta...</div>
    );
  }

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
            {acta.id ? `Editar Acta ${acta.actaNumber}` : "Crear Acta"}
          </h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium">
            {acta.id
              ? "Edita la información del acta antes de imprimir nuevamente."
              : "Prepara el formato para impresión y firma física."}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 text-center ring-1 ring-gray-100 dark:ring-slate-800">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
            Acta No.
          </span>
          <div className="text-3xl font-black text-[#003876] dark:text-blue-400">
            {acta.actaNumber ?? "ACT-0000"}
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
        onSave={handleSave}
        isSaving={isSaving}
        mode={mode}
      />
    </div>
  );
};

export default CreateActaPage;
