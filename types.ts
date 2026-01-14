
export enum OrderStatus {
  PENDIENTE_ARMADO = 'Pendiente de Armado',
  PENDIENTE_FACTURACION = 'Pendiente de Facturación',
  FACTURADO = 'Facturado'
}

export interface Order {
  id: string;
  client: string;
  rut?: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
}

export interface Product {
  id: string;
  name: string;
  emoji: string;
  price: number;
  unit: 'Kilo' | 'Unidad';
}

export interface Client {
  id: string;
  name: string;
  initials: string;
  address: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Operario';
  status: boolean;
  avatar?: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  role: string;
  action: 'Creado' | 'Modificado' | 'Eliminado' | 'Cambio de Estado' | 'Acceso';
  reference: string;
  details: string;
  date: string;
  time: string;
}
