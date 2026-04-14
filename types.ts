
export interface ActaData {
  id: string;
  actaNumber: string;
  fecha: string;
  recibidoPorNombre: string;
  recibidoPorCC: string;
  cargo: string;
  sede: string;
  equipo: string;
  marca: string;
  accesorios: string;
  estado: string;
  observaciones: string;
  entregadoPorNombre?: string;
  entregadoPorCC?: string;
  vistoBueno: string;
  fechaDevolucion?: string;
  recibidoPorDevolucion?: string;
  status: 'draft' | 'pending_scan' | 'uploaded';
  driveFileId?: string;
  scannedFileName?: string;
  recibidoPorFirma?: string; // base64 de la firma
  entregadoPorFirma?: string; // base64 de la firma
  diademaSerial?: string;
  diademaMarcaId?: number;
  laptopMarcaId?: number;
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

export type View = "dashboard" | "create" | "preview" | "other";
