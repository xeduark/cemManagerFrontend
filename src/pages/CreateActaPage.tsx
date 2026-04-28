import React, { useState, useEffect } from "react";
import { ActaData } from "../types/types";
import { backendService } from "../services/api";
import { getSystemUsers } from "../services/user.service";
import { actaService } from "../services/acta.service";
import ActaForm from "../components/form/CreateActaForm";
import { useParams } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";
import Swal from "sweetalert2";

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
  const [isLoadingActa, setIsLoadingActa] = useState(false);

  const mode = id ? "edit" : "create";

  // ✅ IA
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

  // ✅ ALERTAS
  const alert = useAlert();

  // ✅ VALIDACIÓN DE FORMULARIO
  const validateForm = () => {
    const errors: string[] = [];

    if (!acta.recibidoPorNombre?.trim()) {
      errors.push("Nombre Completo");
    }

    if (!acta.recibidoPorCC?.trim()) {
      errors.push("Cédula (CC)");
    }

    if (!acta.cargoId) {
      errors.push("Cargo ");
    }

    if (!acta.sedeId) {
      errors.push("Sede Destino");
    }

    if (!acta.equipo?.trim()) {
      errors.push("Equipo / Modelo");
    }

    if (!acta.laptopSerial?.trim()) {
      errors.push("Serial del equipo");
    }

    if (!acta.entregadoPorNombre?.trim()) {
      errors.push("Entregado por (Usuario)");
    }

    // 🔥 Validación condicional
    const hasDiademas = acta.accesorios?.includes("DIADEMAS");

    if (hasDiademas) {
      if (!acta.diademaMarcaId) {
        errors.push("Marca de la Diadema");
      }

      if (!acta.diademaSerial?.trim()) {
        errors.push("Serial de la Diadema");
      }
    }

    // 🔥 CELULAR
    const hasCelular = acta.accesorios?.includes("CELULAR");

    if (hasCelular) {
      if (!acta.celularNumero?.trim()) {
        errors.push("Número de celular");
      }

      if (!acta.celularOperadorId) {
        errors.push("Operador");
      }

      if (!acta.celularImei?.trim()) {
        errors.push("IMEI");
      }

      if (acta.celularImei && acta.celularImei.length !== 15) {
        errors.push("IMEI debe tener 15 dígitos");
        alert.warning("Número de IMEI inválido", ["El IMEI debe contener exactamente 15 dígitos numéricos."]);
        return false;
      }

      if (!acta.celularMarca?.trim()) {
        errors.push("Marca del celular");
      }
    }

    if (errors.length > 0) {
      alert.warning("Faltan campos", errors);
      return false;
    }

    return true;
  };

  // ✅ GUARDADO CORREGIDO
  const handleSave = async () => {
    if (isSaving) return;
    if (!validateForm()) return;

    // 🔥 VALIDAR ANTES
    if (!acta.cargoId || !acta.sedeId) {
      alert.warning("Selecciona cargo y sede antes de guardar");
      return;
    }

    const confirmed = await alert.confirm(
      acta.id ? "Actualizar acta" : "Guardar acta",
      "¿Deseas continuar?",
    );

    if (!confirmed) return;

    try {
      setIsSaving(true);

      let savedActa;

      const payload = {
        fecha: acta.fecha,
        cargoId: acta.cargoId,
        sedeId: acta.sedeId,
        equipo: acta.equipo,
        accesorios: acta.accesorios,
        observaciones: acta.observaciones,
        recibidoPorNombre: acta.recibidoPorNombre,
        recibidoPorCC: acta.recibidoPorCC,
        entregadoPorNombre: acta.entregadoPorNombre,
        entregadoPorCC: acta.entregadoPorCC,
        vistoBueno: acta.vistoBueno,
        diademaMarcaId: acta.diademaMarcaId,
        diademaSerial: acta.diademaSerial,
        laptopMarcaId: acta.laptopMarcaId,
        laptopSerial: acta.laptopSerial,
        celular: acta.accesorios?.includes("CELULAR")
          ? {
              numero: acta.celularNumero,
              imei: acta.celularImei,
              marca: acta.celularMarca,
              operador_id: acta.celularOperadorId,
            }
          : null,
      };

      console.log("🚀 PAYLOAD FINAL QUE SE ENVÍA:");
      console.log(payload);

      if (acta.id) {
        savedActa = await actaService.updateActa(acta.id, payload);
      } else {
        savedActa = await actaService.createActa(payload);
      }

      setActa(savedActa);

      alert.success("Acta guardada correctamente");
    } catch (error) {
      console.error("❌ ERROR GUARDANDO ACTA:", error);
      alert.error("Error", "No se pudo guardar el acta");
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ PREVIEW
  const handlePreview = () => {
    onPreview();
  };

  // ✅ USERS
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

  // ✅ LOAD ACTA (EDIT)
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

  // ✅ SINCRONIZAR USUARIO
  useEffect(() => {
    if (!acta.entregadoPorNombre || users.length === 0) return;

    const user = users.find((u) => u.nombre === acta.entregadoPorNombre);

    if (user) {
      setSelectedUserId(user.id.toString());
    }
  }, [acta.entregadoPorNombre, users]);

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
