import { API_DB } from "./api";

export const getOperadores = async () => {
  const res = await fetch(`${API_DB}/operadores`);
  return res.json();
};