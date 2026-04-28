
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
  "CELULAR"
];

export const INITIAL_ACTA_DATA = {
  id: '',
  actaNumber: '',
  fecha: new Date().toLocaleDateString('es-CO'),
  cargo: '',
  sede: '',
  equipo: '',
  latopSerial: '',
  accesorios: '',
  estado: 'FUNCIONAL',
  observaciones: '',
  recibidoPorNombre: '',
  recibidoPorCC: '',
  entregadoPorNombre: '',
  entregadoPorCC: '',
  vistoBueno: 'Isaías Quintero',
  status: 'draft' as const,
  diadema_marca: '',
  diadema_serial: '',
  Laptop_marca: '',

  recibidoPorFirma: '',
  entregadoPorFirma: ''
};
