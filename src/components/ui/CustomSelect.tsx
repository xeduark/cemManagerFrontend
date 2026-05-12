import React from "react";
import Select from "react-select";

const baseStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: "var(--bg-input)",
    border: "2px solid transparent",
    borderRadius: "16px",
    padding: "8px 10px",
    minHeight: "56px",
    color: "var(--text-main)",
    boxShadow: "none",
    borderColor: state.isFocused ? "var(--primary)" : "transparent",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "var(--text-main)",
    fontWeight: 700,
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "var(--text-muted)",
    fontWeight: 700,
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: "var(--bg-card)",
    borderRadius: "12px",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "var(--primary)"
      : state.isFocused
      ? "var(--bg-input)"
      : "transparent",
    color: state.isSelected ? "white" : "var(--text-main)",
    fontWeight: 600,
  }),
};

const CustomSelect = ({ estado, ...props }: any) => {
  // 🎨 estilos dinámicos SOLO si viene estado
  const dynamicStyles = estado
    ? {
        ...baseStyles,
        control: (base: any) => ({
          ...base,
          backgroundColor:
            estado === "ABIERTA"
              ? "rgba(34,197,94,0.12)"   // verde suave
              : "rgba(249,115,22,0.12)", // naranja suave
          borderRadius: "12px",
          minHeight: "40px",
          padding: "4px 8px",
        }),
        singleValue: (base: any) => ({
          ...base,
          color:
            estado === "ABIERTA"
              ? "#15803d"
              : "#c2410c",
          fontWeight: 800,
        }),
      }
    : baseStyles;

  return (
    <Select
      {...props}
      styles={dynamicStyles}
      isSearchable={props.isSearchable ?? true}
    />
  );
};

export default CustomSelect;