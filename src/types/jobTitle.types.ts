export interface Cargo {
  id: number;
  nombre: string;
  activo: boolean;
  area_id: number | null;
}

export interface CargoResponse {
  id: number;
  nombre: string;
}