import React from "react";
import { useEffect, useState } from "react";
import { ActaData } from "../../../types";
import { CEM_HEADER_CONFIG } from "../../../constants";
import { getSystemUsers } from "../../services/user.service";

interface ActaPreviewProps {
  data: ActaData;
}
const ActaPreview: React.FC<ActaPreviewProps> = ({ data }) => {
  return (
    <div className="paper w-full max-w-[800px] mx-auto bg-white p-[40px] shadow-2xl border border-gray-200 text-[12px] font-sans leading-relaxed min-h-[1050px] relative text-black">
      {/* Header Table */}
      <table className="w-full border-collapse border border-black mb-6">
        <tbody>
          <tr>
            <td className="border border-black p-4 w-1/3 text-center align-middle">
              <div className="flex flex-col items-center">
                <div className="text-[18px] font-bold leading-tight uppercase">
                  Comité de
                </div>
                <div className="text-[18px] font-bold leading-tight uppercase">
                  Estudios
                </div>
                <div className="text-[18px] font-bold leading-tight uppercase">
                  Médicos
                </div>
              </div>
            </td>
            <td className="border border-black p-4 w-1/3 text-center font-bold text-[14px] align-middle uppercase">
              FORMATO ACTA DE ENTREGA DE EQUIPOS
            </td>
            <td className="border border-black w-1/3 p-0">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-semibold text-center w-1/2">
                      Código:
                    </td>
                    <td className="p-1 text-center font-bold">
                      {CEM_HEADER_CONFIG.codigo}
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black font-semibold text-center">
                      Versión:
                    </td>
                    <td className="p-1 text-center font-bold">
                      {CEM_HEADER_CONFIG.version}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 border-r border-black font-semibold text-center">
                      Fecha:
                    </td>
                    <td className="p-1 text-center font-bold">
                      {CEM_HEADER_CONFIG.fechaFormato}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Date */}
      <div className="mb-4 font-bold text-[13px] flex justify-between">
        <span>FECHA: {data.fecha}</span>
        <span className="text-gray-400"># {data.actaNumber}</span>
      </div>

      {/* Main Form Fields */}
      <div className="border border-black mb-4">
        {[
          { label: "Nombre", value: data.nombre },
          { label: "Cargo", value: data.cargo },
          { label: "Sede", value: data.sede },
          { label: "Equipo:", value: data.equipo },
          { label: "Marca:", value: data.marca },
          { label: "Accesorios:", value: data.accesorios },
          { label: "Estado:", value: data.estado },
          { label: "Observaciones:", value: data.observaciones },
          // { label: 'Departamento', value: data.departamento }, // Campo opcional comentado
        ].map((row, idx) => (
          <div key={idx} className="flex border-b border-black last:border-0">
            <div className="w-[150px] font-bold p-2 border-r border-black bg-gray-50">
              {row.label}
            </div>
            <div className="flex-1 p-2 uppercase text-[11px] min-h-[30px]">
              {row.value}
            </div>
          </div>
        ))}
      </div>

      {/* Commitment Text */}
      <p className="text-center mb-8 italic text-[11px] px-8 font-medium">
        "La persona que firma se hará responsable de los bienes entregados y se
        compromete a cuidar y hacer buen uso de estos, según las políticas
        internas de la institución."
      </p>

      {/* Signature Section */}
      <div className="flex border border-black mb-8 min-h-[200px]">
        {/* Recibido */}
        <div className="flex-1 border-r border-black flex flex-col">
          <div className="p-2 border-b border-black font-bold text-center bg-gray-50">
            Recibido por:
          </div>
          <div className="flex-1 flex flex-col items-center justify-end p-6 pb-2">
            {/* Aquí se podría renderizar la firma capturada: */}
            {/* {data.recibidoPorFirma && <img src={data.recibidoPorFirma} alt="Firma Recibido" className="max-h-16 mt-2"/>} */}
            <div className="w-full border-t border-black mb-2"></div>
            <div className="text-[10px] font-bold uppercase">
              Firma de Recibido
            </div>
          </div>
          <div className="p-3 border-t border-black text-[10px] space-y-1">
            <div className="flex gap-1">
              <span className="font-bold">Nombre:</span>{" "}
              <span className="uppercase">
                {data.recibidoPorNombre || data.nombre}
              </span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">CC:</span> {data.recibidoPorCC}
            </div>
          </div>
        </div>

        {/* Entregado */}
        <div className="flex-1 flex flex-col">
          <div className="p-2 border-b border-black font-bold text-center bg-gray-50">
            Entregado por:
          </div>
          <div className="flex-1 flex flex-col items-center justify-end p-6 pb-2">
            {/* {data.entregadoPorFirma && <img src={data.entregadoPorFirma} alt="Firma Entregado" className="max-h-16 mt-2"/>} */}
            <div className="w-full border-t border-black mb-2"></div>
            <div className="text-[10px] font-bold uppercase">
              Firma de Entrega
            </div>
          </div>
          <div className="p-3 border-t border-black text-[10px] space-y-1">
            <div className="flex gap-1">
              <span className="font-bold">Nombre:</span>
              <p>
                <strong>Entregado por:</strong> {data.entregadoPorNombre}
              </p>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">CC:</span> {data.entregadoPorCC}
            </div>
          </div>
        </div>
      </div>

      {/* VoBo */}
      <div className="mb-10 flex items-center gap-10 px-4">
        <div>
          <div className="font-bold mb-6 text-[11px]">V.° B.°</div>
          <div className="border-t border-black w-40 text-center pt-1 font-bold text-[10px] uppercase">
            {data.vistoBueno}
          </div>
        </div>
        <div className="flex-1">
          <div className="italic text-[10px] text-gray-500 mb-4">
            Espacio reservado para sello o notas adicionales de
            almacén/inventario:
          </div>
          <div className="border border-dashed border-gray-300 h-16 w-full"></div>
        </div>
      </div>

      {/* Devolución */}
      <div className="mb-12 grid grid-cols-2 gap-4 px-4">
        <div className="border-b border-black pb-1">
          Fecha de devolución: _________________
        </div>
        <div className="border-b border-black pb-1">
          Recibido por (Devolución): _________________
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-[40px] right-[40px]">
        <div className="flex justify-between items-end border-t border-gray-300 pt-2">
          <div className="text-[9px] text-gray-400 italic">
            Una vez descargado o impreso este documento se considera COPIA NO
            CONTROLADA.
          </div>
          <div className="text-[10px] font-black">
            CEM - ACTA No. S{data.actaNumber}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActaPreview;
