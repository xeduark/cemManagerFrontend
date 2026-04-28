
export interface ActaData {
  id: number;
  actaNumber: string;
  fecha: string;

  recibidoPorNombre: string;
  recibidoPorCC: string;

  cargoId?: number;
  cargo: string;

  sedeId?: number;
  sede: string;
  
  equipo: string;

  laptopMarcaId?: number;
  laptopSerial: string; 

  accesorios: string;
  estado: string;
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
  celularMarca?: string;
  celularOperadorId?: number;
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
