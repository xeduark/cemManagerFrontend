
export const API_DB = "http://localhost:4000/api";

// src/services/api.ts
// export const createActa = async (acta: any) => {
//   console.log("ACTA ENVIADA:", acta);

//   const res = await fetch("http://localhost:4000/api/actas", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(acta),
//   });

//   if (!res.ok) {
//     const error = await res.text();
//     console.error("ERROR BACKEND:", error);
//     throw new Error(error);
//   }

//   return res.json();
// };

// fetch para obtener obtener todo respecto a las actas
export const backendService = {
  // Guardar acta con archivo
  saveActa: async (acta: any, file?: File) => {
    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    formData.append("acta", JSON.stringify(acta));

    const res = await fetch("http://localhost:3001/api/save-acta", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("API ERROR:", error);
      throw new Error(error);
    }

    return res.json();
  },

  // IA para redactar acta
  generarActa: async (prompt: string) => {
    const res = await fetch("http://localhost:3001/api/generar-acta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("API ERROR:", error);
      throw new Error(error);
    }

    return res.json();
  },
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_DB}${endpoint}`);
    if (!res.ok) {
      const error = await res.text();
      console.error("API ERROR:", error);
      throw new Error(error);
    }
    return res.json();
  },

  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_DB}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("API ERROR:", error);
      throw new Error(error);
    }
    return res.json();
  },

  put: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_DB}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("API ERROR:", error);
      throw new Error(error);
    }
    return res.json();
  },
  patch: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_DB}${endpoint}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("API ERROR:", error);
      throw new Error(error);
    }

    return res.json();
  },
};
