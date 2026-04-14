import React from "react";
import { BrainCircuit, Loader2, Check } from "lucide-react";
import { ActaData } from "../../../types";
import { ACCESORIOS_DISPONIBLES } from "../../../constants";
import { getSedes } from "../../services/sede.service";
import { getCargos } from "../../services/cargo.service";
import { getDiademaMarcas } from "../../services/marcaDiadema.service";
import { getLaptopMarcas } from "../../services/laptopMarca.service";
import Select from "react-select";

//props que recibe el formulario para crear acta, se pasan desde CreateActaPage
interface ActaFormProps {
  acta: ActaData;
  setActa: (acta: ActaData) => void;
  users: any[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  isAIThinking: boolean;
  onSmartAI: () => Promise<void>;
  onPreview: () => void;
  onSave: () => void;
  isSaving: boolean;
  mode: "create" | "edit";
}

//props para el formulario de creación de acta, se encarga de renderizar los campos y manejar la lógica de selección de accesorios, usuarios, cargos y sedes. También tiene botones para mejorar el texto con IA, guardar el acta y previsualizar el formato.
const ActaForm: React.FC<ActaFormProps> = ({
  acta,
  setActa,
  users,
  selectedUserId,
  setSelectedUserId,
  isAIThinking,
  onSmartAI,
  onPreview,
  onSave,
  isSaving,
  mode,
}) => {
  const [cargos, setCargos] = React.useState<any[]>([]);
  const [loadingCargos, setLoadingCargos] = React.useState(true);
  const [sedes, setSedes] = React.useState<any[]>([]);
  const [loadingSedes, setLoadingSedes] = React.useState(true);
  const [diademaMarcas, setDiademaMarcas] = React.useState<any[]>([]);
  const [loadingMarcas, setLoadingMarcas] = React.useState(true);
  const hasDiademas = acta.accesorios?.includes("DIADEMAS");
  const [laptopMarcas, setLaptopMarcas] = React.useState<any[]>([]);
  const [loadingLaptopMarcas, setLoadingLaptopMarcas] = React.useState(true);

  React.useEffect(() => {
    const fetchCargos = async () => {
      try {
        const data = await getCargos();
        setCargos(data);
      } catch (error) {
        console.error("Error cargando cargos", error);
      } finally {
        setLoadingCargos(false);
      }
    };
    fetchCargos();
  }, []);

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

  React.useEffect(() => {
    if (!hasDiademas || diademaMarcas.length > 0) return;

    const fetchMarcas = async () => {
      try {
        setLoadingMarcas(true);
        const data = await getDiademaMarcas();
        setDiademaMarcas(data);
      } catch (err) {
        console.error("Error cargando marcas", err);
      } finally {
        setLoadingMarcas(false);
      }
    };

    fetchMarcas();
  }, [hasDiademas]);

  React.useEffect(() => {
    const fetchLaptopMarcas = async () => {
      try {
        const data = await getLaptopMarcas();
        setLaptopMarcas(data);
      } catch (error) {
        console.error("Error cargando marcas de laptop", error);
      } finally {
        setLoadingLaptopMarcas(false);
      }
    };

    fetchLaptopMarcas();
  }, []);

  const toggleAccessory = (acc: string) => {
    const currentList = acta.accesorios ? acta.accesorios.split(", ") : [];

    let newList: string[];

    if (currentList.includes(acc)) {
      //  QUITAR accesorio
      newList = currentList.filter((item) => item !== acc);

      //  CASO ESPECIAL: DIADEMAS
      if (acc === "DIADEMAS") {
        setActa({
          ...acta,
          accesorios: newList.join(", "),
          diademaMarcaId: undefined,
          diademaSerial: "",
        });
        return;
      }
    } else {
      // ✅ AGREGAR accesorio
      newList = [...currentList, acc];
    }

    setActa({
      ...acta,
      accesorios: newList.join(", "),
    });
  };

  // Styles personalizados para react-select
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "var(--bg-input)",
      border: "2px solid transparent",
      borderRadius: "16px",
      padding: "8px 10px",
      minHeight: "56px",
      color: "var(--text-main)",
      boxShadow: "none",
      borderColor: state.isFocused ? "var(--primary)" : "transparent",
      "&:hover": {
        borderColor: "var(--border-hover)",
      },
    }),

    singleValue: (base: any) => ({
      ...base,
      color: "var(--text-main)",
      fontWeight: 700,
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "var(--text-muted)",
      fontWeight: 700,
    }),

    menu: (base: any) => ({
      ...base,
      backgroundColor: "var(--bg-card)",
      borderRadius: "12px",
    }),

    menuList: (base: any) => ({
      ...base,
      backgroundColor: "var(--bg-card)",
      padding: "6px",
    }),

    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "var(--primary)"
        : state.isFocused
          ? "var(--bg-input)"
          : "transparent",

      color: state.isSelected
        ? "white"
        : state.isFocused
          ? "var(--primary)" // 🔵 texto azul al pasar el mouse
          : "var(--text-main)",

      cursor: "pointer",
      fontWeight: 600,
      borderRadius: "8px",
      padding: "10px 12px",
    }),
  };

  return (
    <div className="space-y-8">
      <div
        className="p-10 rounded-[2.5rem] shadow-sm border"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <h3
          className="text-lg font-bold mb-8 flex items-center gap-3"
          style={{ color: "var(--text-main)" }}
        >
          <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
          Datos del Destinatario
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label
              className="text-[11px] font-black uppercase tracking-widest ml-1"
              style={{ color: "var(--text-muted)" }}
            >
              Nombre Completo
            </label>

            <input
              type="text"
              required
              className="input-field w-full px-5 py-4 text-sm font-bold outline-none shadow-inner focus:border-blue-500"
              value={acta.recibidoPorNombre}
              onChange={(e) =>
                setActa({ ...acta, recibidoPorNombre: e.target.value })
              }
              placeholder="Ej: Edward Muñoz Q"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-[11px] font-black uppercase tracking-widest ml-1"
              style={{ color: "var(--text-muted)" }}
            >
              Cédula (CC)
            </label>

            <input
              type="number"
              required
              className="input-field w-full px-5 py-4 text-sm font-bold outline-none shadow-inner focus:border-blue-500"
              value={acta.recibidoPorCC}
              onChange={(e) =>
                setActa({ ...acta, recibidoPorCC: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-[11px] font-black uppercase tracking-widest ml-1"
              style={{ color: "var(--text-muted)" }}
            >
              Cargo
            </label>

            <Select
              placeholder={
                loadingCargos ? "Cargando cargos..." : "Seleccionar cargo..."
              }
              options={cargos.map((cargo) => ({
                value: cargo.nombre,
                label: cargo.nombre,
              }))}
              value={
                acta.cargo ? { value: acta.cargo, label: acta.cargo } : null
              }
              onChange={(option) =>
                setActa({ ...acta, cargo: option?.value || "" })
              }
              isSearchable
              styles={selectStyles}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-[11px] font-black uppercase tracking-widest ml-1"
              style={{ color: "var(--text-muted)" }}
            >
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
              styles={selectStyles}
            />
          </div>
        </div>

        <div
          className="mt-12 pt-12 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h3
            className="text-lg font-bold mb-8 flex items-center gap-3"
            style={{ color: "var(--text-main)" }}
          >
            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
            Información Técnica
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label
                className="text-[11px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-muted)" }}
              >
                Equipo / Placa
              </label>

              <input
                type="text"
                required
                className="input-field w-full px-5 py-4 text-sm font-bold outline-none shadow-inner focus:border-blue-500"
                value={acta.equipo}
                onChange={(e) => setActa({ ...acta, equipo: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Marca Laptop
              </label>

              <Select
                placeholder={
                  loadingLaptopMarcas
                    ? "Cargando marcas..."
                    : "Seleccionar marca..."
                }
                options={laptopMarcas.map((m) => ({
                  value: m.id,
                  label: m.nombre,
                }))}
                value={
                  acta.laptopMarcaId
                    ? {
                        value: acta.laptopMarcaId,
                        label: laptopMarcas.find(
                          (m) => m.id === acta.laptopMarcaId,
                        )?.nombre,
                      }
                    : null
                }
                onChange={(option) =>
                  setActa({
                    ...acta,
                    laptopMarcaId: option?.value,
                  })
                }
                isSearchable
                styles={selectStyles}
              />
            </div>
            
            <div className="space-y-2">
              <label
                className="text-[11px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-muted)" }}
              >
                No. Serial
              </label>

              <input
                type="text"
                required
                className="input-field w-full px-5 py-4 text-sm font-bold outline-none shadow-inner focus:border-blue-500"
                value={acta.marca}
                onChange={(e) => setActa({ ...acta, marca: e.target.value })}
              />
            </div>

            <div className="md:col-span-2 space-y-3">
              <label
                className="text-[11px] font-black uppercase tracking-widest ml-1"
                style={{ color: "var(--text-muted)" }}
              >
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
                      className={`accessory-btn px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border-2 border-transparent ${
                        isSelected ? "selected" : ""
                      }`}
                      style={{
                        background: isSelected
                          ? "var(--primary)"
                          : "var(--bg-input)",
                        color: isSelected ? "white" : "var(--text-muted)",
                      }}
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

        {hasDiademas && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            {/* MARCA */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Marca Diadema
              </label>

              <Select
                placeholder={
                  loadingMarcas ? "Cargando marcas..." : "Seleccionar marca..."
                }
                options={diademaMarcas.map((m) => ({
                  value: m.id,
                  label: m.nombre,
                }))}
                value={
                  acta.diademaMarcaId
                    ? {
                        value: acta.diademaMarcaId,
                        label: diademaMarcas.find(
                          (m) => m.id === acta.diademaMarcaId,
                        )?.nombre,
                      }
                    : null
                }
                onChange={(option) =>
                  setActa({
                    ...acta,
                    diademaMarcaId: option?.value,
                  })
                }
                isSearchable
                styles={selectStyles}
              />
            </div>

            {/* SERIAL */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest ml-1">
                Serial Diadema
              </label>

              <input
                type="text"
                className="input-field w-full px-5 py-4 text-sm font-bold outline-none shadow-inner focus:border-blue-500"
                value={acta.diademaSerial || ""}
                onChange={(e) =>
                  setActa({
                    ...acta,
                    diademaSerial: e.target.value,
                  })
                }
                placeholder="Ej: 2536AY13B3"
              />
            </div>
          </div>
        )}

        <div className="mt-8 space-y-2">
          <label
            className="text-[11px] font-black uppercase tracking-widest ml-1"
            style={{ color: "var(--text-muted)" }}
          >
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
            styles={selectStyles}
          />
        </div>

        <div
          className=" mt-12 pt-12 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-lg font-bold flex items-center gap-2"
              style={{ color: "var(--text-main)" }}
            >
              Observaciones Técnicas
            </h3>

            <button
              type="button"
              onClick={onSmartAI}
              disabled={isAIThinking || !acta.observaciones}
              className="px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: "var(--btn-secondary-bg)",
                color: "var(--btn-secondary-text)",
              }}
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
            className="w-full border-2 border-transparent focus:border-blue-500 rounded-[2.5rem] px-8 py-7 text-sm font-medium outline-none min-h-[160px] shadow-inner transition-all resize-none"
            style={{
              background: "var(--bg-input)",
              color: "var(--text-main)",
            }}
            placeholder="Escribe el estado del equipo aquí..."
            value={acta.observaciones}
            onChange={(e) =>
              setActa({ ...acta, observaciones: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex-1 btn-save py-5 rounded-[2.5rem] font-black text-lg disabled:opacity-50"
        >
          {isSaving
            ? mode === "edit"
              ? "Actualizando..."
              : "Guardando..."
            : mode === "edit"
              ? "Actualizar Acta"
              : "Guardar Acta"}
        </button>

        <button
          type="button"
          onClick={onPreview}
          className="flex-1 btn-preview py-5 rounded-[2.5rem] font-black text-lg"
        >
          Previsualizar Formato
        </button>
      </div>
    </div>
  );
};

export default ActaForm;
