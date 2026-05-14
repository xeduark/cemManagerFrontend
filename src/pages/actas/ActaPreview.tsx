import React, { useState } from "react";
import { ActaData } from "../../types/types";
import { CEM_HEADER_CONFIG } from "../../../constants";
import SignaturePad from "./SignaturePad";

export interface ActaPreviewProps {
  data: ActaData;
  onSaveFirmaRecibido?: (firma: string) => void;
  onSaveFirmaEntregado?: (firma: string) => void;
}

interface SignatureModalProps {
  open: boolean;
  title: string;
  label: string;
  onClose: () => void;
  onSave: (firma: string) => void;
  onClear: () => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  open,
  title,
  label,
  onClose,
  onSave,
  onClear,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl w-full max-w-xl border border-gray-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Realice la firma digital.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <SignaturePad label={label} onSave={onSave} onClear={onClear} />
      </div>
    </div>
  );
};

const safe = (value?: any) => {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "—";
  }

  return value || "—";
};

const buildAccesorios = (data: ActaData) => {
  const accesorios = [...(data.accesorios || [])];

  return accesorios
    .map((acc) => {
      if (acc === "CELULAR") {
        return `CELULAR (${[
          data.celularMarcaNombre,
          data.celularModelo,
          data.celularNumero,
          data.celularOperadorNombre,
          data.celularImei ? `IMEI: ${data.celularImei}` : null,
        ]
          .filter(Boolean)
          .join(" // ")})`;
      }

      if (acc === "DIADEMAS") {
        return `DIADEMAS (${[data.diademaMarcaNombre, data.diademaSerial]
          .filter(Boolean)
          .join(" // ")})`;
      }

      return acc;
    })
    .join(", ");
};

const ActaPreview: React.FC<ActaPreviewProps> = ({
  data,
  onSaveFirmaRecibido,
  onSaveFirmaEntregado,
}) => {
  const [openFirmaRecibido, setOpenFirmaRecibido] = useState(false);
  const [openFirmaEntregado, setOpenFirmaEntregado] = useState(false);

  return (
    <>
      <div className="paper w-full max-w-[800px] mx-auto bg-white p-[40px] shadow-2xl border border-gray-200 text-[12px] font-sans leading-relaxed min-h-[1050px] relative text-black">
        {/* HEADER */}
        <table className="w-full border-collapse border border-black mb-6">
          <tbody>
            <tr>
              <td className="border p-4 w-1/3 text-center">
                <img
                  src="https://res.cloudinary.com/dbhbuhjum/image/upload/f_auto,q_auto/descarga_moi2yv"
                  alt="Logo"
                  className="max-h-[80px] mx-auto"
                />
              </td>

              <td className="border p-4 w-1/3 text-center font-bold text-[14px] uppercase">
                FORMATO ACTA DE ENTREGA DE EQUIPOS
              </td>

              <td className="border w-1/3 p-0">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="p-1 border-r text-center font-semibold">
                        Código:
                      </td>

                      <td className="text-center font-bold">
                        {CEM_HEADER_CONFIG.codigo}
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="p-1 border-r text-center font-semibold">
                        Versión:
                      </td>

                      <td className="text-center font-bold">
                        {CEM_HEADER_CONFIG.version}
                      </td>
                    </tr>

                    <tr>
                      <td className="p-1 border-r text-center font-semibold">
                        Fecha:
                      </td>

                      <td className="text-center font-bold">
                        {CEM_HEADER_CONFIG.fechaFormato}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* FECHA */}
        <div className="mb-4 font-bold flex justify-between">
          <span>FECHA: {safe(data.fecha)}</span>

          <span className="text-gray-400"># {safe(data.actaNumber)}</span>
        </div>

        {/* CAMPOS */}
        <div className="border mb-4">
          {[
            ["Nombre", data.recibidoPorNombre],
            ["Cargo", data.cargo],
            ["Sede", data.sede],
            [
              "Equipo",
              [data.laptopMarcaNombre, data.equipo].filter(Boolean).join(" "),
            ],
            ["Serial", data.laptopSerial],
            ["Accesorios", buildAccesorios(data)],
            ["Estado", data.estado],
            ["Observaciones", data.observaciones],
          ].map(([label, value], idx) => (
            <div key={idx} className="flex border-b last:border-0">
              <div className="w-[150px] font-bold p-2 border-r bg-gray-50">
                {label}
              </div>

              <div className="flex-1 p-2 uppercase text-[11px]">
                {safe(value as string)}
              </div>
            </div>
          ))}
        </div>

        {/* TEXTO */}
        <p className="text-center mb-8 italic text-[11px] px-8">
          "La persona que firma se hará responsable de los bienes entregados."
        </p>

        {/* FIRMAS */}
        <div className="flex border mb-8 min-h-[200px]">
          {/* RECIBIDO */}
          <div className="flex-1 border-r flex flex-col">
            <div className="p-2 border-b font-bold text-center bg-gray-50">
              Recibido por
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              {data.recibidoPorFirma ? (
                <>
                  <img
                    src={data.recibidoPorFirma}
                    className="max-h-24"
                    alt="firma recibido"
                  />
                  <button
                    onClick={() => setOpenFirmaRecibido(true)}
                    className="text-xs text-blue-600 mt-2 font-semibold"
                  >
                    Rehacer firma
                  </button>
                </>
              ) : (
                <div
                  onClick={() => setOpenFirmaRecibido(true)}
                  className="cursor-pointer group flex flex-col items-center justify-center h-[120px] w-full transition-all"
                >
                  <div className="w-64 border-b-2 border-black mb-2 group-hover:border-blue-600 transition-all" />

                  <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-blue-600 font-bold transition-all">
                    Click para firmar
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 border-t text-[10px]">
              <div>
                <b>Nombre:</b> {safe(data.recibidoPorNombre)}
              </div>

              <div>
                <b>CC:</b> {safe(data.recibidoPorCC)}
              </div>
            </div>
          </div>

          {/* ENTREGADO */}
          <div className="flex-1 flex flex-col">
            <div className="p-2 border-b font-bold text-center bg-gray-50">
              Entregado por
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              {data.entregadoPorFirma ? (
                <>
                  <img
                    src={data.entregadoPorFirma}
                    className="max-h-24"
                    alt="firma entrega"
                  />
                  <button
                    onClick={() => setOpenFirmaEntregado(true)}
                    className="text-xs text-blue-600 mt-2 font-semibold"
                  >
                    Rehacer firma
                  </button>
                </>
              ) : (
                <div
                  onClick={() => setOpenFirmaEntregado(true)}
                  className="cursor-pointer group flex flex-col items-center justify-center h-[120px] w-full transition-all"
                >
                  <div className="w-64 border-b-2 border-black mb-2 group-hover:border-blue-600 transition-all" />

                  <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-blue-600 font-bold transition-all">
                    Click para firmar
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 border-t text-[10px]">
              <div>
                <b>Nombre:</b> {safe(data.entregadoPorNombre)}
              </div>

              <div>
                <b>CC:</b> {safe(data.entregadoPorCC)}
              </div>
            </div>
          </div>
        </div>

        {/* VISTO BUENO */}
        <div className="mb-10 px-4">
          <div className="font-bold mb-2">V.° B.°</div>

          <div className="border-t w-40 pt-1 text-center font-bold text-[10px]">
            {safe(data.vistoBueno)}
          </div>
        </div>
      </div>

      {/* MODALES DE FIRMA COMPATIBLES CON HTML2CANVAS */}
      <SignatureModal
        open={openFirmaRecibido}
        title="Firma de Recibido"
        label="Firme aquí"
        onClose={() => setOpenFirmaRecibido(false)}
        onSave={(firma) => {
          if (onSaveFirmaRecibido) onSaveFirmaRecibido(firma);
          setOpenFirmaRecibido(false);
        }}
        onClear={() => {}}
      />

      <SignatureModal
        open={openFirmaEntregado}
        title="Firma de Entregado"
        label="Firme aquí"
        onClose={() => setOpenFirmaEntregado(false)}
        onSave={(firma) => {
          if (onSaveFirmaEntregado) onSaveFirmaEntregado(firma);
          setOpenFirmaEntregado(false);
        }}
        onClear={() => {}}
      />
    </>
  );
};

export default ActaPreview;
