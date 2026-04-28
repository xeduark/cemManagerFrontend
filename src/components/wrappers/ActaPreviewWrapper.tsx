import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActaData } from "../../types/types";
import ActaPreview from "../../pages/actas/ActaPreview";
import ActaSubNavbar from "../layout/ActaSubNavbar";
import { Printer, FileUp } from "lucide-react";

interface PreviewWrapperProps {
  currentActa: ActaData;
  setCurrentActa: (acta: ActaData) => void;
  saveToHistory: (acta: ActaData) => void;
  triggerUpload: (id: string) => void;
  handlePrint: () => void;
}

const PreviewWrapper: React.FC<PreviewWrapperProps> = ({
  currentActa,
  setCurrentActa,
  saveToHistory,
  triggerUpload,
  handlePrint,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ Siempre garantizar string válido
  const actaId = String(id === "draft" ? currentActa.id : id || "");

  // ✅ Firma recibido
  const handleFirmaRecibido = (firma: string) => {
    setCurrentActa({
      ...currentActa,
      recibidoPorFirma: firma,
    });
  };

  // ✅ Firma entregado
  const handleFirmaEntregado = (firma: string) => {
    setCurrentActa({
      ...currentActa,
      entregadoPorFirma: firma,
    });
  };

  return (
    <div className="animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
      <ActaSubNavbar
        title="Formato Listo para Imprimir"
        subtitle="Imprime este documento, solicita las firmas y cárgalo al sistema."
        onBack={() => navigate("/create")}
        onSave={() => saveToHistory(currentActa)}
        actions={
          <>
            <button
              onClick={handlePrint}
              className="bg-white dark:bg-slate-800 border-2 border-gray-900 dark:border-slate-700 text-gray-900 dark:text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 font-black text-sm hover:bg-gray-50 hover:text-blue-600 transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir Acta
            </button>

            <button
              onClick={() => actaId && triggerUpload(actaId)}
              className="bg-[#003876] dark:bg-blue-600 text-white px-8 py-3.5 rounded-2xl flex items-center gap-3 font-black text-sm hover:scale-105 transition-all shadow-lg"
            >
              <FileUp className="w-5 h-5" />
              Ya tengo el Escaneo
            </button>
          </>
        }
      />

      <div className="print-area bg-white shadow-2xl dark:shadow-blue-500/5 rounded-sm p-4 ring-1 ring-gray-200 dark:ring-slate-800 mb-20 overflow-auto">
        <ActaPreview
          data={currentActa}
          onSaveFirmaRecibido={handleFirmaRecibido}
          onSaveFirmaEntregado={handleFirmaEntregado}
        />
      </div>
    </div>
  );
};

export default PreviewWrapper;