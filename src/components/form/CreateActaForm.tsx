import React from "react";
import { BrainCircuit, Loader2, Check } from "lucide-react";
import { ActaData } from "../../../types";
import { ACCESORIOS_DISPONIBLES } from "../../../constants";
import { getSedes } from "../../services/api";
import Select from "react-select";

interface ActaFormProps {
  acta: ActaData;
  setActa: (acta: ActaData) => void;
  users: any[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  isAIThinking: boolean;
  onSmartAI: () => Promise<void>;
  onPreview: () => void;
}

const ActaForm: React.FC<ActaFormProps> = ({
  acta,
  setActa,
  users,
  selectedUserId,
  setSelectedUserId,
  isAIThinking,
  onSmartAI,
  onPreview,
}) => {
  // color de fondo para inputs
  const inputBg = "#1e293b"; // slate-800
  const inputLight = "#f9fafb"; // gray-50
  const inputBorder = "#e5e7eb3a"; // gray-200 with opacity

  //aqui empieza el estado para cargar las sedes

  const [sedes, setSedes] = React.useState<any[]>([]);
  const [loadingSedes, setLoadingSedes] = React.useState(true);

  // cargar sedes al montar el componente
  React.useEffect(() => {
    const fetchSedes = async () => {
      try {
        const data = await getSedes();
        setSedes(data);
      } catch (error) {
        console.error("Error cargando sedes", error);
      } finally {
        setLoadingSedes(false);
      }
    };

    fetchSedes();
  }, []);

  const toggleAccessory = (acc: string) => {
    const currentList = acta.accesorios ? acta.accesorios.split(", ") : [];
    let newList;
    if (currentList.includes(acc)) {
      newList = currentList.filter((item) => item !== acc);
    } else {
      newList = [...currentList, acc];
    }
    setActa({ ...acta, accesorios: newList.join(", ") });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          Datos del Destinatario
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 ">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1 ">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500  rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none transition-all shadow-inner hover:border-gray-200 dark:hover:border-slate-700"
              value={acta.nombre}
              onChange={(e) => setActa({ ...acta, nombre: e.target.value })}
              placeholder="Ej: CARLOS MARTINEZ"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Cédula (CC)
            </label>
            <input
              type="number"
              required
              className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500  rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner hover:border-gray-200 dark:hover:border-slate-700"
              value={acta.recibidoPorCC}
              onChange={(e) =>
                setActa({ ...acta, recibidoPorCC: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Cargo / Posición
            </label>
            <input
              type="text"
              required
              className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner hover:border-gray-200 dark:hover:border-slate-700"
              value={acta.cargo}
              onChange={(e) => setActa({ ...acta, cargo: e.target.value })}
            />
          </div>
          <div className="space-y-2 ">
            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Sede Destino
            </label>
            <Select
              placeholder={
                loadingSedes ? "Cargando sedes..." : "Seleccionar sede..."
              }
              options={sedes.map((sede) => ({
                value: sede.nombre,
                label: sede.nombre,
              }))}
              value={acta.sede ? { value: acta.sede, label: acta.sede } : null}
              onChange={(option) =>
                setActa({ ...acta, sede: option?.value || "" })
              }
              isSearchable
              styles={{
                control: (base, state) => ({
                  ...base,
                  backgroundColor: inputBg,
                  border: "2px solid transparent",
                  borderRadius: "16px",
                  padding: "8px 10px",
                  minHeight: "56px",
                  color: "white",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                  borderColor: state.isFocused ? "#3b82f6" : "transparent",
                  "&:hover": {
                    borderColor: inputBorder,
                  },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: "700",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#94a3b8",
                  fontWeight: "700",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1e293b",
                  color: "white",
                  borderRadius: "12px",
                }),
              }}
            />
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-50 dark:border-slate-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
            Información Técnica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Equipo / Placa
              </label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold uppercase outline-none shadow-inner hover:border-gray-200 dark:hover:border-slate-700"
                value={acta.equipo}
                onChange={(e) => setActa({ ...acta, equipo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Marca / No. Serial
              </label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner hover:border-gray-200 dark:hover:border-slate-700"
                value={acta.marca}
                onChange={(e) => setActa({ ...acta, marca: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Accesorios Incluidos
              </label>
              <div className="flex flex-wrap gap-3">
                {ACCESORIOS_DISPONIBLES.map((acc) => {
                  const isSelected = acta.accesorios?.split(", ").includes(acc);
                  return (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => toggleAccessory(acc)}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border-2 ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none"
                          : "bg-gray-50 dark:bg-slate-800 border-transparent text-gray-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-700"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {acc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Entregado por
          </label>

          <Select
            placeholder="Seleccionar usuario..."
            options={users.map((user) => ({
              value: user.id,
              label: user.nombre,
            }))}
            value={
              selectedUserId
                ? {
                    value: selectedUserId,
                    label: users.find((u) => u.id.toString() === selectedUserId)
                      ?.nombre,
                  }
                : null
            }
            onChange={(option) => {
              const userId = option?.value?.toString() || "";
              setSelectedUserId(userId);

              const user = users.find((u) => u.id.toString() === userId);

              if (user) {
                setActa({
                  ...acta,
                  entregadoPorNombre: user.nombre,
                  entregadoPorCC: user.dni,
                });
              }
            }}
            isSearchable
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: inputBg,
                border: "2px solid transparent",
                borderRadius: "16px",
                padding: "8px 10px",
                minHeight: "56px",
                color: "white",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                borderColor: state.isFocused ? "#3b82f6" : "transparent",
                cursor: "pointer",
                "&:hover": {
                  borderColor: inputBorder,
                },
              }),

              singleValue: (base) => ({
                ...base,
                color: "white",
                fontWeight: "700",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#94a3b8",
                fontWeight: "700",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: inputBg,
                color: "white",
                borderRadius: "12px",
              }),
            }}
          />
        </div>

        <div className="mt-12 pt-12 border-t border-gray-50 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Observaciones Técnicas
            </h3>
            <button
              type="button"
              onClick={onSmartAI}
              disabled={isAIThinking || !acta.observaciones}
              className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              {isAIThinking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <BrainCircuit className="w-4 h-4" />
              )}
              Redactar con IA
            </button>
          </div>
          <textarea
            className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border-2 border-transparent focus:border-blue-500 rounded-[2.5rem] px-8 py-7 text-sm font-medium outline-none min-h-[160px] shadow-inner hover:border-gray-200 dark:hover:border-slate-700 transition-all resize-none"
            placeholder="Escribe el estado del equipo aquí..."
            value={acta.observaciones}
            onChange={(e) =>
              setActa({ ...acta, observaciones: e.target.value })
            }
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onPreview}
        className="w-full bg-[#003876] dark:bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xl hover:bg-[#002a5a] dark:hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 dark:shadow-none"
      >
        Previsualizar Formato de Impresión
      </button>
    </div>
  );
};

export default ActaForm;
