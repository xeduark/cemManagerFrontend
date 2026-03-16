import { api } from "./api";
// Ejemplo de uso para obtener sedes
export interface Sede {
  id: number;
  nombre: string;
}

export const getSedes = async (): Promise<Sede[]> => {
  return api.get("/sedes");
};