import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import NavbarWrapper from "./src/components/wrappers/NavbarWrapper";
import AppRoutes from "./src/routes/AppRoutes";
import { ActaData } from "./types";
import { INITIAL_ACTA_DATA } from "./constants";
import { backendService } from "./src/services/api";

const App: React.FC = () => {
  const [history, setHistory] = useState<ActaData[]>([]);
  const [currentActa, setCurrentActa] = useState<ActaData>(INITIAL_ACTA_DATA);

  // Estado para tema
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("cem_theme");
    return (saved as "light" | "dark") || "light";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingForId, setUploadingForId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar historial de actas desde localStorage al iniciar la aplicación
  useEffect(() => {
    const saved = localStorage.getItem("cem_actas_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Aplicar tema al cargar y cuando cambie
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("cem_theme", theme);
  }, [theme]);

  // Guardar tema en localStorage
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const saveToHistory = (acta: ActaData) => {
    const exists = history.find((h) => h.id === acta.id);
    const updated = exists
      ? history.map((h) => (h.id === acta.id ? acta : h))
      : [acta, ...history];
    setHistory(updated);
    localStorage.setItem("cem_actas_history", JSON.stringify(updated));
  };

  const handlePrint = () => {
    window.print();
    saveToHistory(currentActa);
  };

  const triggerUpload = (actaId: string) => {
    setUploadingForId(actaId);
    fileInputRef.current?.click();
  };

  return (
    <BrowserRouter>
      <NavbarWrapper theme={theme} toggleTheme={toggleTheme} />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="application/pdf"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !uploadingForId) return;
          setIsUploading(true);
          const targetActa =
            history.find((h) => h.id === uploadingForId) || currentActa;
          const result = await backendService.saveActa(targetActa, file);
          if (result.success) {
            saveToHistory({
              ...targetActa,
              status: "uploaded",
              driveFileId: result.driveId,
              scannedFileName: file.name,
            });
          }
          setIsUploading(false);
          setUploadingForId(null);
        }}
      />
      <AppRoutes
        history={history}
        currentActa={currentActa}
        setCurrentActa={setCurrentActa}
        saveToHistory={saveToHistory}
        triggerUpload={triggerUpload}
        handlePrint={handlePrint}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isUploading={isUploading}
        uploadingForId={uploadingForId}
      />
    </BrowserRouter>
  );
};

export default App;
