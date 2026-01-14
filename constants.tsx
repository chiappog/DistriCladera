
import { Order, OrderStatus, Product, Client, User, AuditEntry } from './types';

export const INITIAL_ORDERS: Order[] = [
  { id: '#ORD-001', client: 'Distribuidora Central', rut: '76.444.333-1', date: '24/10/2023', items: 15, total: 1250.00, status: OrderStatus.PENDIENTE_FACTURACION },
  { id: '#ORD-002', client: 'Supermercado El Sol', rut: '98.123.456-K', date: '24/10/2023', items: 4, total: 320.50, status: OrderStatus.PENDIENTE_ARMADO },
  { id: '#ORD-003', client: 'Tienda Los Hermanos', rut: '12.345.678-9', date: '24/10/2023', items: 22, total: 2100.00, status: OrderStatus.FACTURADO },
  { id: '#ORD-004', client: 'Mini Market Apolo', rut: '14.555.222-3', date: '24/10/2023', items: 8, total: 850.00, status: OrderStatus.PENDIENTE_ARMADO },
  { id: '#ORD-005', client: 'Bodega San Juan', rut: '18.999.000-1', date: '24/10/2023', items: 12, total: 1100.00, status: OrderStatus.FACTURADO },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'PD-1001', name: 'Manzanas Royal Gala', emoji: '🍎', price: 1.20, unit: 'Kilo' },
  { id: 'PD-1002', name: 'Caja de Banano Premium', emoji: '🍌', price: 12.50, unit: 'Unidad' },
  { id: 'PD-1003', name: 'Aguacate Hass', emoji: '🥑', price: 4.80, unit: 'Kilo' },
  { id: 'PD-1004', name: 'Piña Golden', emoji: '🍍', price: 2.00, unit: 'Unidad' },
  { id: 'PD-1005', name: 'Saco de Papas (25kg)', emoji: '🥔', price: 15.00, unit: 'Unidad' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'CL-001', name: 'Distribuidora Central', initials: 'DC', address: 'Av. Libertador 1234, CABA', status: 'Active' },
  { id: 'CL-002', name: 'Market Express', initials: 'ME', address: 'Calle Falsa 123, Springfield', status: 'Active' },
  { id: 'CL-003', name: 'Supermercados Norte', initials: 'SN', address: 'Ruta 5 Km 40, Córdoba', status: 'Inactive' },
  { id: 'CL-004', name: 'Almacén Doña Rosa', initials: 'AD', address: 'Calle 9 de Julio 550, Mendoza', status: 'Active' },
  { id: 'CL-005', name: 'Tech Solutions Ltd', initials: 'TS', address: 'Av. Corrientes 2000, Rosario', status: 'Pending' },
];

export const INITIAL_USERS: User[] = [
  { id: 'U-001', name: 'Juan Pérez', email: 'juan@seguimiento.com', role: 'Admin', status: true, avatar: 'https://picsum.photos/seed/juan/100/100' },
  { id: 'U-002', name: 'Maria Lopez', email: 'maria@seguimiento.com', role: 'Operario', status: true, avatar: 'https://picsum.photos/seed/maria/100/100' },
  { id: 'U-003', name: 'Carlos Ruiz', email: 'carlos@seguimiento.com', role: 'Operario', status: false, avatar: 'https://picsum.photos/seed/carlos/100/100' },
];

export const INITIAL_AUDIT: AuditEntry[] = [
  { id: 'A-001', user: 'Maria Garcia', role: 'Gerente de Logística', action: 'Cambio de Estado', reference: '#PED-1024', details: 'Estado actualizado de Pendiente a Enviado', date: '24 Oct 2023', time: '14:30:05' },
  { id: 'A-002', user: 'Carlos Rodriguez', role: 'Almacén', action: 'Creado', reference: '#INV-5502', details: 'Nuevo registro de inventario creado: 50 unidades.', date: '24 Oct 2023', time: '10:15:22' },
  { id: 'A-003', user: 'System Auto', role: 'Bot', action: 'Modificado', reference: '#CFG-SYS', details: 'Sincronización nocturna completada. Stock actualizado.', date: '23 Oct 2023', time: '23:00:00' },
];
