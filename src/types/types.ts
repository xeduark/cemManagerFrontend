export interface ActaData {
  id: number;
  actaNumber: string;
  fecha: string;

  recibidoPorNombre: string;
  recibidoPorCC: string;

  cargoId?: number;

  // CAMPOS SOLO PARA PREVIEW, NO SE ENVIAN AL BACK
  cargo?: string;
  sede?: string;
  celularMarcaNombre?: string;
  celularOperadorNombre?: string;
  diademaMarcaNombre?: string;
  laptopMarcaNombre?: string;
  // ----------------------------

  sedeId?: number;

  equipo: string;

  laptopMarcaId?: number;
  laptopSerial: string;

  accesorios: string[];

  estado: "ABIERTA" | "CERRADA";
  observaciones: string;

  entregadoPorNombre?: string;
  entregadoPorCC?: string;
  vistoBueno: string;

  fechaDevolucion?: string;
  recibidoPorDevolucion?: string;

  driveFileId?: string;
  scannedFileName?: string;

  recibidoPorFirma?: string;
  entregadoPorFirma?: string;

  diademaSerial?: string;
  diademaMarcaId?: number;

  celularNumero?: string;
  celularImei?: string;
  celularMarcaId?: number;
  celularOperadorId?: number;
  celularModelo?: string;
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
