
import { Laptop } from 'lucide-react';
import { HeaderConfig } from './src/types/types';

export const CEM_HEADER_CONFIG: HeaderConfig = {
  codigo: '-DC-012FO',
  version: '003',
  fechaFormato: '10/11/2020'
};

export const ACCESORIOS_DISPONIBLES = [
  "CARGADOR",
  "DIADEMAS",
  "TECLADO",
  "MOUSE",
  "CELULAR",
  "BASE REFRIGERANTE"
];

export const INITIAL_ACTA_DATA = {
  id: 0,
  actaNumber: "",
  fecha: new Date().toLocaleDateString("es-CO"),

  cargoId: undefined,
  sedeId: undefined,

  equipo: "",

  laptopSerial: "",
  laptopMarcaId: undefined,

  accesorios: [],

  estado: "ABIERTA" as "ABIERTA",

  observaciones: "",

  recibidoPorNombre: "",
  recibidoPorCC: "",

  entregadoPorNombre: "",
  entregadoPorCC: "",

  vistoBueno: "Isaías Quintero",

  diademaMarcaId: undefined,
  diademaSerial: "",

  celularNumero: "",
  celularImei: "",
  celularOperadorId: undefined,
  celularMarcaId: undefined,
};
