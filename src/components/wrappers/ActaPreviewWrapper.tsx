import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActaData } from "../../types/types";
import ActaPreview from "../../pages/actas/ActaPreview";
import ActaSubNavbar from "../layout/ActaSubNavbar";
import { Printer, FileUp, FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import PrintSafeActa from "@/pages/actas/PrintSafeActa";
import jsPDF from "jspdf";

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

  const handleFirmaRecibido = (firma: string) => {
    setCurrentActa({
      ...currentActa,
      recibidoPorFirma: firma,
    });
  };

  const handleFirmaEntregado = (firma: string) => {
    setCurrentActa({
      ...currentActa,
      entregadoPorFirma: firma,
    });
  };

  // ✅ Descargar PDF
  const handleDownloadPDF = async () => {
    const element = document.getElementById("pdf-content");

    if (!element) return;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;

    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Nombre de archivo con formato: ACTA_{recibidoPorCC}.pdf
    const nombreArchivo = `ACTA_${currentActa.actaNumber}_${currentActa.recibidoPorCC}.pdf`;

    pdf.save(nombreArchivo);
  };

  return (
    <div className="animate-in zoom-in-95 duration-300 max-w-5xl mx-auto">
      <div
        style={{
          position: "absolute",
          left: "-99999px",
          top: 0,
        }}
      >
        <PrintSafeActa data={currentActa} />
      </div>
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
              onClick={handleDownloadPDF}
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
              <FileDown className="w-5 h-5" />
              Descargar PDF
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
