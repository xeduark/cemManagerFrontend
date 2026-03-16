import { api } from "./api";

export const getCargos = () => {
  return api.get("/cargos");
};