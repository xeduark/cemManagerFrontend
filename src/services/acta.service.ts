// src/services/acta.service.ts
import { ActaData } from "../../types";
import { api } from "./api";

export interface ActaPayload {
  fecha: string;
  cargo: string;
  sede: string;
  equipo: string;
  marca: string;
  accesorios: string;
  observaciones: string;
  recibidoPorNombre: string;
  recibidoPorCC: string;
  entregadoPorNombre?: string;
  entregadoPorCC?: string;
  vistoBueno: string;
  status: "draft" | "pending_scan" | "uploaded";
  driveFileId?: string;
  scannedFileName?: string;
}

// Función para mapear backend → frontend
const mapBackendToActaData = (actaFromBackend: any): ActaData => {
  const payload = actaFromBackend.payload || {};

  return {
    id: actaFromBackend.id.toString(),
    actaNumber: actaFromBackend.acta_number,
    fecha: payload.fecha ?? "",
    cargo: payload.cargo ?? "",
    sede: payload.sede ?? "",
    equipo: payload.equipo ?? "",
    marca: payload.marca ?? "",
    accesorios: payload.accesorios ?? "",
    estado: actaFromBackend.estado,
    observaciones: payload.observaciones ?? "",
    recibidoPorNombre: payload.recibidoPorNombre ?? "",
    recibidoPorCC: payload.recibidoPorCC ?? "",
    entregadoPorNombre: payload.entregadoPorNombre ?? "",
    entregadoPorCC: payload.entregadoPorCC ?? "",
    vistoBueno: payload.vistoBueno ?? "",
    fechaDevolucion: payload.fechaDevolucion ?? "",
    recibidoPorDevolucion: payload.recibidoPorDevolucion ?? "",
    status: payload.status ?? "draft",
    driveFileId: payload.driveFileId,
    scannedFileName: payload.scannedFileName,
  };
};

// Servicio para manejar todas las operaciones relacionadas con actas

export const actaService = {
  createActa: async (payload: ActaPayload): Promise<ActaData> => {
    const rawActa = await api.post("/actas", payload);
    return mapBackendToActaData(rawActa);
  },

  // Función para obtener actas con paginación y búsqueda
  getActas: async (
    page: number = 1,
    limit: number = 10,
    search: string = "",
  ): Promise<{
    data: ActaData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> => {
    const response = await api.get(
      `/actas?page=${page}&limit=${limit}&search=${search}`,
    );

    return {
      ...response,
      data: response.data.map(mapBackendToActaData),
    };
  },

  // Función para obtener una acta por ID
  getActaById: async (id: string): Promise<ActaData> => {
    const rawActa = await api.get(`/actas/${id}`);
    return mapBackendToActaData(rawActa);
  },

  // Función para actualizar una acta existente
  updateActa: async (id: string, payload: ActaPayload) => {
    const rawActa = await api.post(`/actas/${id}`, {
      payload,
    });

    return mapBackendToActaData(rawActa);
  },
};
