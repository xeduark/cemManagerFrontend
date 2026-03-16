import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { View } from "../../../types";

interface NavbarWrapperProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const NavbarWrapper: React.FC<NavbarWrapperProps> = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
// Funciones para manejar la navegación
  const handleDashboard = () => navigate("/actas");
  const handleNewActa = () => navigate("/create");

  // Mapear la ruta actual a un View válido
  let view: View;
  if (location.pathname === "/actas") view = "dashboard";
  else if (location.pathname.startsWith("/create")) view = "create";
  else if (location.pathname.startsWith("/preview")) view = "preview";
  else view = "dashboard"; // Valor por defecto para rutas no reconocidas

  return (
    <Navbar
      view={view}
      theme={theme}
      toggleTheme={toggleTheme}
      onDashboard={handleDashboard}
      onNewActa={handleNewActa}
    />
  );
};

export default NavbarWrapper;