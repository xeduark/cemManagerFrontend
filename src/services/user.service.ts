import { api } from "./api";

export const getSystemUsers = () => {
  return api.get("/users");
};