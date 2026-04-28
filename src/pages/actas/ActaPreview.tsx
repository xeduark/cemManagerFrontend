import React from "react";
import { ActaData } from "../../types/types";
import { CEM_HEADER_CONFIG } from "../../../constants";
import SignaturePad from "./SignaturePad";

export interface ActaPreviewProps {
  data: ActaData;
  handlePrint?: () => void;
  triggerUpload?: (actaId: string) => void;
  onSaveFirmaRecibido?: (firma: string) => void;
  onSaveFirmaEntregado?: (firma: string) => void;
}

const safe = (value?: string) => value || "—";

const ActaPreview: React.FC<ActaPreviewProps> = ({
  data,
  handlePrint,
  triggerUpload,
  onSaveFirmaRecibido,
  onSaveFirmaEntregado,
}) => {
  return (
    <div className="paper w-full max-w-[800px] mx-auto bg-white p-[40px] shadow-2xl border border-gray-200 text-[12px] font-sans leading-relaxed min-h-[1050px] relative text-black">

      {/* BOTONES */}
      <div className="mt-4 flex gap-4">
        {handlePrint && (
          <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded">
            Imprimir
          </button>
        )}
        {triggerUpload && (
          <button onClick={() => triggerUpload(data.id)} className="px-4 py-2 bg-green-600 text-white rounded">
            Subir Escaneo
          </button>
        )}
      </div>

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
                    <td className="p-1 border-r text-center font-semibold">Código:</td>
                    <td className="text-center font-bold">{CEM_HEADER_CONFIG.codigo}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-1 border-r text-center font-semibold">Versión:</td>
                    <td className="text-center font-bold">{CEM_HEADER_CONFIG.version}</td>
                  </tr>
                  <tr>
                    <td className="p-1 border-r text-center font-semibold">Fecha:</td>
                    <td className="text-center font-bold">{CEM_HEADER_CONFIG.fechaFormato}</td>
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
          ["Equipo", data.equipo],
          ["Serial", data.laptopSerial],
          ["Accesorios", data.accesorios],
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
            {data.recibidoPorFirma && data.recibidoPorFirma.length > 0 ? (
              <>
                <img src={data.recibidoPorFirma} className="max-h-24" alt="firma recibido" />
                <button
                  onClick={() => onSaveFirmaRecibido?.("")}
                  className="text-xs text-red-500 mt-2"
                >
                  Rehacer firma
                </button>
              </>
            ) : (
              <SignaturePad
                label="Firma quien recibe"
                onSave={onSaveFirmaRecibido || (() => {})}
                onClear={() => onSaveFirmaRecibido?.("")}
              />
            )}
          </div>

          <div className="p-3 border-t text-[10px]">
            <div><b>Nombre:</b> {safe(data.recibidoPorNombre)}</div>
            <div><b>CC:</b> {safe(data.recibidoPorCC)}</div>
          </div>
        </div>

        {/* ENTREGADO */}
        <div className="flex-1 flex flex-col">
          <div className="p-2 border-b font-bold text-center bg-gray-50">
            Entregado por
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {data.entregadoPorFirma && data.entregadoPorFirma.length > 0 ? (
              <>
                <img src={data.entregadoPorFirma} className="max-h-24" alt="firma entrega" />
                <button
                  onClick={() => onSaveFirmaEntregado?.("")}
                  className="text-xs text-red-500 mt-2"
                >
                  Rehacer firma
                </button>
              </>
            ) : (
              <SignaturePad
                label="Firma quien entrega"
                onSave={onSaveFirmaEntregado || (() => {})}
                onClear={() => onSaveFirmaEntregado?.("")}
              />
            )}
          </div>

          <div className="p-3 border-t text-[10px]">
            <div><b>Nombre:</b> {safe(data.entregadoPorNombre)}</div>
            <div><b>CC:</b> {safe(data.entregadoPorCC)}</div>
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
  );
};

export default ActaPreview;