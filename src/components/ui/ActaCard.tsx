import React from "react";
import { ActaData } from "@/types/types";

interface Props {
  acta: ActaData;
  onView: (acta: ActaData) => void;
}

const ActaCard: React.FC<Props> = ({ acta, onView }) => {
  // Pon aquí el enlace directo de tu logo en Cloudinary
  const logoUrl = "https://res.cloudinary.com/decmvewpj/image/upload/v1778729030/COMITE_DE_ESTUDIOS_MEDICOS_xjdyzk.png"; 

  return (
    <div className="nike-style-card mx-auto">
      
      {/* 1. BARRA SUPERIOR: Muestra el Estado fijo arriba de todo */}
      <div className="card-top-bar">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-main)" }}>
            {acta.estado}
          </span>
          <span className={`w-3 height-3 w-3 h-3 rounded-full inline-block ${
            acta.estado.toLowerCase() === 'abierta' ? 'bg-green-500' : 'bg-orange-500'
          }`} />
        </div>
      </div>

      {/* 2. BLOQUE CENTRAL: El contenedor del logo (Sube con el Hover) */}
      <div className="image-block border-y" style={{ borderColor: "var(--border-color-card)" }}>
        
        {/* Lado Izquierdo: Textos de Identificación */}
        <div className="flex flex-col justify-center">
          <h3 className="acta-number-text font-black text-xl tracking-tight leading-none mt-1">
            {`#${acta.actaNumber}`}
          </h3>
        </div>

        {/* Lado Derecho: Imagen del Logo (Equivalente al Charizard) */}
        <div className="w-1/2 h-full flex items-center justify-center p-2">
          <img 
            src={logoUrl} 
            alt="Logo Corporativo" 
            className="logo-cem max-w-full max-h-[100px] object-contain drop-shadow-md"
          />
        </div>

      </div>

      {/* 3. BLOQUE INFERIOR: Se despliega exponiendo los datos y el botón */}
      <div className="content-block flex flex-col justify-end">
        
        {/* REVEAL 1: Nombre del responsable */}
        <div className="text-center delay-reveal reveal-1">
          <h4 className="font-extrabold text-base tracking-tight" style={{ color: "var(--text-main)" }}>
            {acta.recibidoPorNombre}
          </h4>
        </div>

        {/* REVEAL 2: Tabla de especificaciones (Estilo Hue / Sat / Lum de tu imagen) */}
        <div className="grid grid-cols-2 gap-2 mt-3 delay-reveal reveal-2 text-center">
          <div className="p-2 rounded-lg" style={{ background: "var(--bg-input)" }}>
            <span className="block text-[9px] font-bold uppercase tracking-wider opacity-60" style={{ color: "var(--text-main)" }}>
              Equipo
            </span>
            <span className="text-xs font-bold block truncate mt-0.5" style={{ color: "var(--text-main)" }}>
              {acta.equipo || "N/A"}
            </span>
          </div>
          
          <div className="p-2 rounded-lg" style={{ background: "var(--bg-input)" }}>
            <span className="block text-[9px] font-bold uppercase tracking-wider opacity-60" style={{ color: "var(--text-main)" }}>
              Fecha
            </span>
            <span className="text-xs font-bold block mt-0.5" style={{ color: "var(--text-main)" }}>
              {acta.fecha}
            </span>
          </div>
        </div>

        {/* REVEAL 3: Botón de apertura final */}
        <div className="mt-4 delay-reveal reveal-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(acta);
            }}
            className="w-full py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider btn-card"
          >
            Ver Detalles
          </button>
        </div>

      </div>

    </div>
  );
};

export default ActaCard;
