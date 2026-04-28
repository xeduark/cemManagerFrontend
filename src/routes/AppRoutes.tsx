// src/routes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import CreateActaPage from "../pages/CreateActaPage";
import PreviewWrapper from "../components/wrappers/ActaPreviewWrapper";
import { useNavigate } from "react-router-dom";
import { ActaData } from "../types/types";
interface AppRoutesProps {
  history: ActaData[];
  currentActa: ActaData;
  setCurrentActa: (acta: ActaData) => void;
  saveToHistory: (acta: ActaData) => void;
  triggerUpload: (id: string) => void;
  handlePrint: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isUploading: boolean;
  uploadingForId: string | null;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  currentActa,
  setCurrentActa,
  saveToHistory,
  triggerUpload,
  handlePrint,
  searchTerm,
  setSearchTerm,
  isUploading,
  uploadingForId,
}) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/actas"
        element={
          <DashboardPage
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isUploading={isUploading}
            uploadingForId={uploadingForId}
            onStartNew={() => {}} // ya no necesitamos pasar navigate
            onTriggerUpload={triggerUpload}
            onViewActa={(acta: ActaData) => {
              setCurrentActa(acta);
              navigate(`/edit/${acta.id}`);
            }}
          />
        }
      />
      <Route
        path="/create"
        element={
          <CreateActaPage
            acta={currentActa}
            setActa={setCurrentActa}
            onPreview={() => navigate(`/preview/${currentActa.id || "draft"}`)} // usamos draft como id temporal para la vista previa antes de guardar
            onCancel={() => navigate("/actas")}
          />
        }
      />
      <Route
        path="/edit/:id"
        element={
          <CreateActaPage
            acta={currentActa}
            setActa={setCurrentActa}
            onPreview={() => navigate(`/preview/${currentActa.id || "draft"}`)}
            onCancel={() => navigate("/actas")}
          />
        }
      />
      <Route
        path="/preview/:id"
        element={
          <PreviewWrapper
            currentActa={currentActa}
            saveToHistory={saveToHistory}
            triggerUpload={triggerUpload}
            handlePrint={handlePrint}
            setCurrentActa={setCurrentActa}
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
