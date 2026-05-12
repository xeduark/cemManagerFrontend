import React from "react";
import CustomSelect from "./CustomSelect";

type Estado = "ABIERTA" | "CERRADA";

interface Props {
  value: Estado;
  onChange: (value: Estado) => void;
}

const ActaStatusSelect: React.FC<Props> = ({ value, onChange }) => {
  const options = [
    { value: "ABIERTA", label: "Abierta" },
    { value: "CERRADA", label: "Cerrada" },
  ];

  const selected = options.find((o) => o.value === value);

  return (
    <div className="w-36">
      <CustomSelect
        options={options}
        value={selected}
        onChange={(o: any) => onChange(o.value)}
        isSearchable={false}
      />
    </div>
  );
};

export default ActaStatusSelect;