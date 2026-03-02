
import { HeaderConfig } from './types';

export const CEM_HEADER_CONFIG: HeaderConfig = {
  codigo: '-DC-012FO',
  version: '003',
  fechaFormato: '10/11/2020'
};

export const ACCESORIOS_DISPONIBLES = [
  "CARGADOR",
  "DIADEMAS",
  "TECLADO",
  "MOUSE"
];

export const INITIAL_ACTA_DATA = {
  id: '',
  actaNumber: '',
  fecha: new Date().toLocaleDateString('es-CO'),
  nombre: '',
  cargo: '',
  sede: '',
  equipo: '',
  marca: '',
  accesorios: '',
  estado: 'FUNCIONAL',
  observaciones: '',
  recibidoPorNombre: '',
  recibidoPorCC: '',
  entregadoPorNombre: '',
  entregadoPorCC: '',
  vistoBueno: 'Juan David Orozco',
  status: 'draft' as const,
};
