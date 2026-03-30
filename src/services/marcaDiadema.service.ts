import { API_DB } from "./api";

export const getDiademaMarcas = async () => {
  const res = await fetch(`${API_DB}/actas/diadema-marcas`);
  return res.json();
};