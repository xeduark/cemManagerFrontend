import { api } from "./api";

interface UploadFirmaPayload {
  firma: File;

  acta_id: number;

  tipo: "RECIBIDO" | "ENTREGADO";

  nombre: string;
  documento: string;
}

export const firmaService = {
  uploadFirma: async (payload: UploadFirmaPayload) => {
    const formData = new FormData();

    formData.append("firma", payload.firma);

    formData.append("acta_id", payload.acta_id.toString());

    formData.append("tipo", payload.tipo);

    formData.append("nombre", payload.nombre);

    formData.append("documento", payload.documento);

     const response = await api.post("/firmas/firma", formData);

    return response.data;
  },
};