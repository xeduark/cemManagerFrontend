import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActaData } from "../../types/types";
import ActaPreview from "../../pages/actas/ActaPreview";
import ActaSubNavbar from "../layout/ActaSubNavbar";
import { Printer, FileUp } from "lucide-react";
import { firmaService } from "@/services/firma.service";
import { base64ToFile } from "@/utils/base64ToFile";
import Swal from "sweetalert2";

interface PreviewWrapperProps {
  currentActa: ActaData;
  setCurrentActa: (acta: ActaData) => void;
  triggerUpload: (id: string) => void;
  handlePrint: () => void;
}

const PreviewWrapper: React.FC<PreviewWrapperProps> = ({
  currentActa,
  setCurrentActa,
  triggerUpload,
  handlePrint,
}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ Siempre garantizar string válido
  const actaId = String(id === "draft" ? currentActa.id : id || "");

  // ✅ Firma recibido
  const handleFirmaRecibido = async (firma: string) => {
    try {
      if (!currentActa.id) {
        Swal.fire({
          icon: "warning",
          title: "Guarda el acta primero",
        });

        return;
      }

      const file = base64ToFile(firma, "firma-recibido.png");

      const response = await firmaService.uploadFirma({
        firma: file,
        acta_id: currentActa.id,
        tipo: "RECIBIDO",
        nombre: currentActa.recibidoPorNombre || "",
        documento: currentActa.recibidoPorCC || "",
      });

      setCurrentActa({
        ...currentActa,
        recibidoPorFirma: response.firma.firma_url,
      });

      Swal.fire({
        icon: "success",
        title: "Firma guardada",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error subiendo firma",
      });
    }
  };

  // ✅ Firma entregado
  const handleFirmaEntregado = async (firma: string) => {
    try {
      if (!currentActa.id) {
        Swal.fire({
          icon: "warning",
          title: "Guarda el acta primero",
        });

        return;
      }

      const file = base64ToFile(firma, "firma-entregado.png");

      const response = await firmaService.uploadFirma({
        firma: file,
        acta_id: currentActa.id,
        tipo: "ENTREGADO",
        nombre: currentActa.entregadoPorNombre || "",
        documento: currentActa.entregadoPorCC || "",
      });

      setCurrentActa({
        ...currentActa,
        entregadoPorFirma: response.firma.firma_url,
      });

      Swal.fire({
        icon: "success",
        title: "Firma guardada",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error subiendo firma",
      });
    }
  };

  return (
    <div className="animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
      <ActaSubNavbar
        title="Formato Listo para Imprimir"
        subtitle="Imprime este documento, solicita las firmas y cárgalo al sistema."
        onBack={() => navigate("/create")}
        actions={
          <>
            <button
              onClick={handlePrint}
              className="
        px-8 py-3.5 rounded-2xl
        flex items-center gap-2
        font-black text-sm
        transition-all

        bg-[var(--bg-card)]
        text-[var(--text-main)]

        border-2
        border-[var(--border-color)]

        hover:scale-[1.02]
        hover:border-[var(--primary)]
      "
            >
              <Printer className="w-4 h-4" />
              Imprimir Acta
            </button>

            <button
              onClick={() => actaId && triggerUpload(actaId)}
              className="
        px-8 py-3.5 rounded-2xl
        flex items-center gap-3
        font-black text-sm
        transition-all shadow-lg

        bg-[var(--primary)]
        text-white

        hover:scale-105
        hover:bg-[var(--primary-hover)]
      "
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
