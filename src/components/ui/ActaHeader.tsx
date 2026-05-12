import React from "react";
import ActaStatusSelect from "./ActaStatusSelect";

interface Props {
  title: string;
  subtitle?: string;
  estado: "ABIERTA" | "CERRADA";
  onChangeEstado?: (estado: "ABIERTA" | "CERRADA") => void;
}

const ActaHeader: React.FC<Props> = ({
  title,
  subtitle,
  estado,
  onChangeEstado,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3
          className="text-lg font-black"
          style={{ color: "var(--text-main)" }}
        >
          {title}
        </h3>

        {subtitle && (
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Estado */}
      {onChangeEstado ? (
        <div
          className="px-3 py-1 rounded-xl"
          style={{
            background:
              estado === "ABIERTA"
                ? "rgba(34,197,94,0.1)"
                : "rgba(249,115,22,0.1)",
          }}
        >
          <ActaStatusSelect
            value={estado}
            onChange={onChangeEstado}
          />
        </div>
      ) : (
        // modo solo visual (para cards o preview)
        <span
          className="text-xs font-bold px-3 py-1 rounded-xl"
          style={{
            background:
              estado === "ABIERTA"
                ? "rgba(34,197,94,0.1)"
                : "rgba(249,115,22,0.1)",
            color:
              estado === "ABIERTA"
                ? "var(--success)"
                : "#f97316",
          }}
        >
          {estado}
        </span>
      )}
    </div>
  );
};

export default ActaHeader;