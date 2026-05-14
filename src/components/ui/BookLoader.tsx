import React from "react";
import "../../styles/theme.css"; 

const BookLoader: React.FC = () => {
  return (
    // Contenedor responsivo: menos padding en móvil, más en pantallas grandes
    <div className="flex flex-col justify-center items-center py-12 md:py-20 lg:py-28 gap-8 md:gap-12 w-full min-h-[300px]">
      
      {/* El Libro: escala 1.2x en móvil, 1.5x en tablets (md) y 1.8x en pantallas grandes (lg) */}
      <div className="book scale-[1.2] md:scale-[1.5] lg:scale-[1.8] transition-transform duration-300">
        <div className="inner">
          <div className="left"></div>
          <div className="middle"></div>
          <div className="right"></div>
        </div>
        <ul>
          {[...Array(18)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div>
      
      {/* Texto responsivo: cambia el tamaño de letra según el dispositivo */}
      <span className="text-xs md:text-sm font-semibold tracking-wide text-gray-400 dark:text-slate-500 animate-pulse text-center px-4 mt-2">
        Cargando actas...
      </span>
    </div>
  );
};

export default BookLoader;
