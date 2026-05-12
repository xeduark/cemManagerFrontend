import Card from "../ui/Card";
import { ActaData } from "@/types/types";
import ActaHeader from "../ui/ActaHeader";

interface Props {
  acta: ActaData;
  onView: (acta: ActaData) => void;
}

const ActaCard: React.FC<Props> = ({ acta, onView }) => {
  return (
    <Card>
      {/* HEADER SOLO VISUAL */}
      <ActaHeader
        title={`#${acta.actaNumber}`}
        subtitle={acta.fecha}
        estado={acta.estado}
      />

      {/* NOMBRE */}
      <h4 className="font-bold text-lg" style={{ color: "var(--text-main)" }}>
        {acta.recibidoPorNombre}
      </h4>

      {/* EQUIPO */}
      <div
        className="rounded-xl p-4 mt-4"
        style={{
          background: "var(--bg-input)",
          border: "1px solid var(--border-color)",
        }}
      >
        <span className="block text-[10px] font-bold uppercase mb-1">
          Equipo
        </span>

        <span className="text-sm font-semibold">
          {acta.equipo || "No especificado"}
        </span>
      </div>

      {/* BOTÓN */}
      <div className="mt-6">
        <button
          onClick={() => onView(acta)}
          className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide btn-card"
        >
          Ver Acta
        </button>
      </div>
    </Card>
  );
};

export default ActaCard;