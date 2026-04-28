import Swal from "sweetalert2";

export const useAlert = () => {
  const success = (title: string, text?: string) => {
    Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: "#2563eb",
    });
  };

  const error = (title: string, text?: string) => {
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#dc2626",
    });
  };

  const warning = (title: string, items?: string[]) => {
    Swal.fire({
      icon: "warning",
      title,
      html: items
        ? items.map((i) => `• ${i}`).join("<br/>")
        : undefined,
      confirmButtonColor: "#f59e0b",
    });
  };

  const confirm = async (title: string, text?: string) => {
    const result = await Swal.fire({
      icon: "question",
      title,
      text,
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563eb",
    });

    return result.isConfirmed;
  };

  return {
    success,
    error,
    warning,
    confirm,
  };
};  