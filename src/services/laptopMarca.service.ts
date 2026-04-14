import { API_DB } from "./api";

export const getLaptopMarcas = async () => {
  const res = await fetch(`${API_DB}/actas/laptop-marcas`);
  return res.json();
};