
export interface ActaData {
  id: string;
  actaNumber: string;
  fecha: string;
  nombre: string;
  cargo: string;
  sede: string;
  equipo: string;
  marca: string;
  accesorios: string;
  estado: string;
  observaciones: string;
  recibidoPorNombre: string;
  recibidoPorCC: string;
  entregadoPorNombre?: string;
  entregadoPorCC?: string;
  vistoBueno: string;
  fechaDevolucion?: string;
  recibidoPorDevolucion?: string;
  status: 'draft' | 'pending_scan' | 'uploaded';
  driveFileId?: string;
  scannedFileName?: string;
}

type User = {
  id: number;
  nombre: string;
  dni: string;
};

export interface HeaderConfig {
  codigo: string;
  version: string;
  fechaFormato: string;
}

export type View = 'dashboard' | 'create' | 'preview';
