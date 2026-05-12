import { API_DB } from "./api";

export const getCelularMarcas = async () => {
  const res = await fetch(`${API_DB}/actas/celular-marcas`);
  return res.json();
};