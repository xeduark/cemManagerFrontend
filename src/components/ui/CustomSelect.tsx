import React from "react";
import Select from "react-select";

const selectStyles = {
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

const CustomSelect = (props: any) => {
  return <Select {...props} styles={selectStyles} isSearchable />;
};

export default CustomSelect;