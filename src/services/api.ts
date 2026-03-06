export async function generarActa(prompt: string) {
  const res = await fetch("http://localhost:3001/api/generar-acta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  })

  if (!res.ok) throw new Error("Error generando acta")
  return res.json()
}

// src/services/api.ts
export const createActa = async (acta: any) => {
  const res = await fetch("http://localhost:4000/api/actas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(acta),
  });

  if (!res.ok) {
    throw new Error("Error creando el acta");
  }

  return res.json();
};

// src/services/api.ts
export const backendService = {
  // crear nueva acta
  getNextActaNumber: async (): Promise<number> => {
    const res = await fetch("http://localhost:4000/api/actas");
    if (!res.ok) throw new Error("Error obteniendo número de acta");
    const data = await res.json();
    return data.nextNumber;
  },

  // Guarda el acta con el archivo escaneado
  saveActa: async (acta: any, file: File): Promise<{ success: boolean; driveId?: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("acta", JSON.stringify(acta));

    const res = await fetch("http://localhost:3001/api/save-acta", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Error subiendo acta");
    return res.json();
  },

  // Genera texto de acta usando IA
  generarActa: async (prompt: string): Promise<{ textoGenerado: string }> => {
    const res = await fetch("http://localhost:4000/api/actas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error("Error generando acta con IA");
    return res.json();
  },
};

// api para traer usuarios del sistema
const API_BASE = "http://localhost:4000/api";

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error("Error en la API");
    return res.json();
  },

  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error en la API");
    return res.json();
  },
};

// Ejemplo de uso para obtener sedes
export interface Sede {
  id: number;
  nombre: string;
}

export const getSedes = async (): Promise<Sede[]> => {
  return api.get("/sedes");
};
