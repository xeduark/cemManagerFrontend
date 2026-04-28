import React from "react";
import { BrainCircuit, Loader2, Check } from "lucide-react";
import { ActaData } from "../../types/types";
import { ACCESORIOS_DISPONIBLES } from "../../../constants";
import { getSedes } from "../../services/sede.service";
import { getCargos } from "../../services/cargo.service";
import { getDiademaMarcas } from "../../services/marcaDiadema.service";
import { getLaptopMarcas } from "../../services/laptopMarca.service";
import { getOperadores } from "../../services/operador.service";

import {
  Input,
  TextArea,
  Button,
  CustomSelect,
  Card,
  Section,
  AccessoryButton,
} from "../ui";

import { CargoResponse } from "../../types/jobTitle.types";
import { SedeResponse } from "../../types/sedes.types";

type Marca = {
  id: number;
  nombre: string;
};

interface ActaFormProps {
  acta: ActaData;
  setActa: (acta: ActaData) => void;
  users: { id: number; nombre: string; dni: string }[];
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  isAIThinking: boolean;
  onSmartAI: () => Promise<void>;
  onPreview: () => void;
  onSave: () => void;
  isSaving: boolean;
  mode: "create" | "edit";
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
  onSave,
  isSaving,
  mode,
}) => {
  const [cargos, setCargos] = React.useState<CargoResponse[]>([]);
  const [sedes, setSedes] = React.useState<SedeResponse[]>([]);
  const [diademaMarcas, setDiademaMarcas] = React.useState<Marca[]>([]);
  const [laptopMarcas, setLaptopMarcas] = React.useState<Marca[]>([]);
  const [operadores, setOperadores] = React.useState<Marca[]>([]);

  const accesoriosList = acta.accesorios?.split(", ") || [];
  const hasDiademas = accesoriosList.includes("DIADEMAS");
  const hasCelular = accesoriosList.includes("CELULAR");

  // FETCH
  React.useEffect(() => {
    getCargos().then(setCargos);
    getSedes().then(setSedes);
    getLaptopMarcas().then(setLaptopMarcas);
  }, []);

  React.useEffect(() => {
    if (!hasDiademas || diademaMarcas.length > 0) return;
    getDiademaMarcas().then(setDiademaMarcas);
  }, [hasDiademas]);

  React.useEffect(() => {
    if (!hasCelular) return;

    if (operadores.length === 0) {
      getOperadores().then(setOperadores);
    }
  }, [hasCelular]);

  // LOGIC
  const toggleAccessory = (acc: string) => {
    const exists = accesoriosList.includes(acc);

    const updated = exists
      ? accesoriosList.filter((item) => item !== acc)
      : [...accesoriosList, acc];

    const newActa: ActaData = {
      ...acta,
      accesorios: updated.join(", "),
    };

    if (acc === "DIADEMAS" && exists) {
      newActa.diademaMarcaId = undefined;
      newActa.diademaSerial = "";
    }

    if (acc === "CELULAR" && exists) {
      newActa.celularNumero = "";
      newActa.celularImei = "";
      newActa.celularMarca = "";
      newActa.celularOperadorId = undefined;
    }

    setActa(newActa);
  };

  return (
    <div className="space-y-8">
      <Card>
        {/* DESTINATARIO */}
        <Section title="Datos del Destinatario" color="blue">
          <div className="grid md:grid-cols-2 gap-8">
            <Input
              placeholder="Nombre completo"
              value={acta.recibidoPorNombre ?? ""}
              onChange={(e) =>
                setActa({ ...acta, recibidoPorNombre: e.target.value })
              }
            />

            <Input
              placeholder="Cédula"
              value={acta.recibidoPorCC ?? ""}
              onChange={(e) =>
                setActa({ ...acta, recibidoPorCC: e.target.value })
              }
            />

            <CustomSelect
              placeholder="Cargo"
              options={cargos.map((c) => ({
                value: c.id,
                label: c.nombre,
              }))}
              value={
                acta.cargoId
                  ? {
                      value: acta.cargoId,
                      label: cargos.find((c) => c.id === acta.cargoId)?.nombre,
                    }
                  : null
              }
              onChange={(o: any) => setActa({ ...acta, cargoId: o?.value })}
            />

            <CustomSelect
              placeholder="Sede"
              options={sedes.map((s) => ({
                value: s.id, // ✅ ID (NO nombre)
                label: s.nombre,
              }))}
              value={
                acta.sedeId
                  ? {
                      value: acta.sedeId,
                      label: sedes.find((s) => s.id === acta.sedeId)?.nombre,
                    }
                  : null
              }
              onChange={(o: any) => setActa({ ...acta, sedeId: o?.value })}
            />
          </div>
        </Section>

        {/* EQUIPO */}
        <Section title="Información Técnica" color="yellow">
          <div className="grid md:grid-cols-2 gap-8">
            <Input
              placeholder="Equipo / Placa"
              value={acta.equipo ?? ""}
              onChange={(e) => setActa({ ...acta, equipo: e.target.value })}
            />

            <CustomSelect
              placeholder="Marca Laptop"
              options={laptopMarcas.map((m) => ({
                value: m.id,
                label: m.nombre,
              }))}
              value={
                laptopMarcas.find((m) => m.id === acta.laptopMarcaId)
                  ? {
                      value: acta.laptopMarcaId,
                      label: laptopMarcas.find(
                        (m) => m.id === acta.laptopMarcaId,
                      )!.nombre,
                    }
                  : null
              }
              onChange={(o: any) =>
                setActa({
                  ...acta,
                  laptopMarcaId: o ? Number(o.value) : undefined,
                })
              }
            />

            <Input
              placeholder="Serial"
              value={acta.laptopSerial || ""}
              onChange={(e) =>
                setActa({ ...acta, laptopSerial: e.target.value })
              }
            />
          </div>
        </Section>

        {/* ACCESORIOS */}
        <Section title="Accesorios" color="blue">
          <div className="flex flex-wrap gap-3">
            {ACCESORIOS_DISPONIBLES.map((acc) => {
              const selected = accesoriosList.includes(acc);

              return (
                <AccessoryButton
                  key={acc}
                  selected={selected}
                  onClick={() => toggleAccessory(acc)}
                >
                  {selected && <Check size={14} />} {acc}
                </AccessoryButton>
              );
            })}
          </div>
        </Section>

        {/* DIADEMAS */}
        {hasDiademas && (
          <Section title="Diademas" color="yellow">
            <div className="grid md:grid-cols-2 gap-6">
              <CustomSelect
                placeholder="Marca Diadema"
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
                onChange={(o: any) =>
                  setActa({
                    ...acta,
                    diademaMarcaId: o ? Number(o.value) : undefined,
                  })
                }
              />

              <Input
                placeholder="Serial Diadema"
                value={acta.diademaSerial || ""}
                onChange={(e) =>
                  setActa({
                    ...acta,
                    diademaSerial: e.target.value,
                  })
                }
              />
            </div>
          </Section>
        )}

        {/* CELULAR */}
        {hasCelular && (
          <Section title="Celular" color="yellow">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                placeholder="Número"
                value={acta.celularNumero || ""}
                onChange={(e) =>
                  setActa({ ...acta, celularNumero: e.target.value })
                }
              />

              <CustomSelect
                placeholder="Operador"
                options={operadores.map((o) => ({
                  value: o.id,
                  label: o.nombre,
                }))}
                value={
                  acta.celularOperadorId
                    ? {
                        value: acta.celularOperadorId,
                        label: operadores.find(
                          (o) => o.id === acta.celularOperadorId,
                        )?.nombre,
                      }
                    : null
                }
                onChange={(o: any) =>
                  setActa({
                    ...acta,
                    celularOperadorId: o ? Number(o.value) : undefined,
                  })
                }
              />

              <Input
                placeholder="IMEI"
                value={acta.celularImei || ""}
                onChange={(e) =>
                  setActa({ ...acta, celularImei: e.target.value })
                }
              />

              <Input
                placeholder="Marca"
                value={acta.celularMarca || ""}
                onChange={(e) =>
                  setActa({ ...acta, celularMarca: e.target.value })
                }
              />
            </div>
          </Section>
        )}

        {/* USUARIO */}
        <Section title="Entrega" color="blue">
          <CustomSelect
            placeholder="Entregado por"
            options={users.map((u) => ({
              value: u.id,
              label: `${u.nombre} - ${u.dni}`,
            }))}
            value={
              selectedUserId
                ? {
                    value: selectedUserId,
                    label:
                      users.find((u) => u.id === Number(selectedUserId))
                        ?.nombre || "",
                  }
                : null
            }
            onChange={(o: any) => {
              const user = users.find((u) => u.id === Number(o?.value));
              if (user) {
                setSelectedUserId(String(user.id));
                setActa({
                  ...acta,
                  entregadoPorNombre: user.nombre,
                  entregadoPorCC: user.dni,
                });
              }
            }}
          />
        </Section>
        {/* OBSERVACIONES */}
        <Section
          title="Observaciones"
          color="blue"
          action={
            <Button
              variant="secondary"
              onClick={onSmartAI}
              disabled={isAIThinking}
            >
              {isAIThinking ? (
                <Loader2 className="animate-spin" />
              ) : (
                <BrainCircuit />
              )}
            </Button>
          }
        >
          <TextArea
            value={acta.observaciones}
            onChange={(e) =>
              setActa({ ...acta, observaciones: e.target.value })
            }
          />
        </Section>

        {/* BOTONES */}
        <div className="flex gap-4 mt-6">
          <Button variant="success" onClick={onSave} disabled={isSaving}>
            {isSaving
              ? mode === "edit"
                ? "Actualizando..."
                : "Guardando..."
              : mode === "edit"
                ? "Actualizar"
                : "Guardar"}
          </Button>

          <Button variant="primary" onClick={onPreview}>
            Previsualizar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ActaForm;
