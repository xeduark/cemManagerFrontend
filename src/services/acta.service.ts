// src/services/acta.service.ts
import { ActaData } from '../../types';
import { api } from './api';

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
  status: 'draft' | 'pending_scan' | 'uploaded';
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
    scannedFileName: payload.scannedFileName
  };
};

// Servicio para manejar todas las operaciones relacionadas con actas

export const actaService = {

 createActa: async (payload: ActaPayload): Promise<ActaData> => {
  const rawActa = await api.post('/actas', payload);
  return mapBackendToActaData(rawActa);
},

  // Función para obtener las últimas actas (ejemplo: últimas 10)           
  getLatestActas: async (limit: number = 10): Promise<ActaData[]> => {
    const rawActas = await api.get(`/actas?limit=${limit}`);
    return rawActas.map(mapBackendToActaData);
  },

  // Función para buscar actas por nombre o número
  searchActas: async (query: string): Promise<ActaData[]> => {
    const rawActas = await api.get(`/actas/search?q=${query}`);
    return rawActas.map(mapBackendToActaData);
  },

  // Función para obtener todas las actas (puede ser paginada o con filtros según tu backend)
  getAllActas: async (): Promise<ActaData[]> => {
    const rawActas = await api.get('/actas');
    return rawActas.map(mapBackendToActaData);
  },

  // Función para obtener una acta por ID
  getActaById: async (id: string): Promise<ActaData> => {
    const rawActa = await api.get(`/actas/${id}`);
    return mapBackendToActaData(rawActa);
  },

  // Función para actualizar una acta existente
  updateActa: async (id: string, payload: ActaPayload) => {
  const rawActa = await api.post(`/actas/${id}`, {
    payload
  });

  return mapBackendToActaData(rawActa);
}
};