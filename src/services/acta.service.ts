import { ActaData } from "../types/types";
import { api } from "./api";

// =============================
// DTO FRONT → BACK
// =============================
export interface ActaPayload {
  fecha: string;

  cargoId: number;
  sedeId: number;

  equipo: string;

  laptopSerial: string;
  laptopMarcaId?: number;

  accesorios: string[];
  observaciones: string;

  estado: "ABIERTA" | "CERRADA";

  recibidoPorNombre: string;
  recibidoPorCC: string;

  entregadoPorNombre?: string;
  entregadoPorCC?: string;

  vistoBueno: string;

  diademaMarcaId?: number;
  diademaSerial?: string;

  celular?: {
    numero: string;
    imei: string;
    marca_id: number;
    operador_id: number;
    modelo: string;
  } | null;
}

// =============================
// DTO BACK (TIPADO OPCIONAL)
// =============================
interface BackendActa {
  id: number;
  acta_number: string;
  fecha: string;

  cargo_id: number;

  // CAMPOS SOLO PARA PREVIEW, NO SE ENVIAN AL BACK
  cargo?: string;
  sede?: string;
  celular_marca_nombre?: string;
  celular_operador_nombre?: string;
  diadema_marca_nombre?: string;
  laptop_marca_nombre?: string;
  // ----------------------------

  sede_id: number;

  equipo: string;

  laptop_serial: string;
  laptop_marca_id?: number;

  accesorios: string;
  estado: "ABIERTA" | "CERRADA";
  observaciones: string;

  recibido_por_nombre: string;
  recibido_por_cc: string;

  entregado_por_nombre?: string;
  entregado_por_cc?: string;

  visto_bueno: string;

  diadema_serial?: string;
  diadema_marca_id?: number;

  celular_numero?: string;
  celular_imei?: string;
  celular_marca_id?: number;
  celular_operador_id?: number;
  celular_modelo?: string;
}

// =============================
// MAPPER BACK → FRONT
// =============================
const mapBackendToActaData = (data: BackendActa): ActaData => ({
  id: data.id,

  actaNumber: data.acta_number,
  fecha: data.fecha,

  cargoId: data.cargo_id,

  // CAMPOS SOLO PARA PREVIEW, NO SE ENVIAN AL BACK
  cargo: data.cargo,
  sede: data.sede,
  celularMarcaNombre: data.celular_marca_nombre,
  celularOperadorNombre: data.celular_operador_nombre,
  diademaMarcaNombre: data.diadema_marca_nombre,
  laptopMarcaNombre: data.laptop_marca_nombre,
  // ----------------------------

  sedeId: data.sede_id,

  equipo: data.equipo,

  laptopSerial: data.laptop_serial,
  laptopMarcaId: data.laptop_marca_id ?? undefined,

  accesorios: data.accesorios
    ? data.accesorios.split(", ").map((acc) => acc.trim())
    : [],
  estado: data.estado as "ABIERTA" | "CERRADA",

  observaciones: data.observaciones,

  recibidoPorNombre: data.recibido_por_nombre,
  recibidoPorCC: data.recibido_por_cc,

  entregadoPorNombre: data.entregado_por_nombre,
  entregadoPorCC: data.entregado_por_cc,

  vistoBueno: data.visto_bueno,

  diademaSerial: data.diadema_serial ?? undefined,
  diademaMarcaId: data.diadema_marca_id ?? undefined,

  celularNumero: data.celular_numero ?? "",
  celularImei: data.celular_imei ?? "",
  celularMarcaId: data.celular_marca_id ?? undefined,
  celularOperadorId: data.celular_operador_id ?? undefined,
  celularModelo: data.celular_modelo ?? "",
});

// =============================
// MAPPER FRONT → BACK
// ✅ AHORA ENVIAMOS camelCase
// =============================
const mapPayloadToBackend = (payload: ActaPayload) => {
  const mapped = {
    fecha: payload.fecha,

    cargoId: payload.cargoId,
    sedeId: payload.sedeId,

    equipo: payload.equipo,

    laptopSerial: payload.laptopSerial,
    laptopMarcaId: payload.laptopMarcaId ?? null,

    accesorios: payload.accesorios.join(", "),
    observaciones: payload.observaciones,

    estado: payload.estado,

    recibidoPorNombre: payload.recibidoPorNombre,
    recibidoPorCC: payload.recibidoPorCC,

    entregadoPorNombre: payload.entregadoPorNombre ?? null,
    entregadoPorCC: payload.entregadoPorCC ?? null,

    vistoBueno: payload.vistoBueno,

    diademaMarcaId: payload.diademaMarcaId ?? null,
    diademaSerial: payload.diademaSerial ?? null,

    celular: payload.celular ?? null,
  };

  // 🔍 DEBUG CLAVE
  console.log("🚀 PAYLOAD FRONT → BACK:", mapped);

  return mapped;
};

// =============================
// SERVICE
// =============================
export const actaService = {
  // CREAR
  createActa: async (payload: ActaPayload): Promise<ActaData> => {
    const mapped = mapPayloadToBackend(payload);

    const raw = await api.post("/actas", mapped);

    return mapBackendToActaData(raw);
  },

  // LISTADO
  getActas: async (page = 1, limit = 10, search = "") => {
    const response = await api.get(
      `/actas?page=${page}&limit=${limit}&search=${search}`,
    );

    return {
      ...response,
      data: response.data.map(mapBackendToActaData),
    };
  },

  // GET BY ID
  getActaById: async (id: string | number): Promise<ActaData> => {
    const raw = await api.get(`/actas/${id}`);
    return mapBackendToActaData(raw);
  },

  // UPDATE
  updateActa: async (
    id: string | number,
    payload: ActaPayload,
  ): Promise<ActaData> => {
    const mapped = mapPayloadToBackend(payload);

    const raw = await api.put(`/actas/${id}`, mapped);

    return mapBackendToActaData(raw);
  },

  // ACTUALIZAR ESTADO DE ACTA
  updateEstado: async (
    id: number,
    estado: "ABIERTA" | "CERRADA",
  ): Promise<ActaData> => {
    const raw = await api.patch(`/actas/${id}/estado`, { estado });
    return mapBackendToActaData(raw);
  },
};
