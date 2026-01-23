
import { Order, OrderStatus, Product, Client, User, AuditEntry } from './types';

export const INITIAL_ORDERS: Order[] = [
  { 
    id: '#ORD-001', 
    client: 'Distribuidora Central', 
    rut: '76.444.333-1', 
    date: '24/10/2023', 
    items: 7, // 5 manzanas + 2 bananos = 7 items
    total: 28.00, 
    status: OrderStatus.PENDIENTE_FACTURACION,
    estimatedTotal: 25.00, // Solo productos Unidad: 2 × $12.50 = $25.00
    actualTotal: 28.00, // Productos Unidad + productos KG: 25.00 + (2.5 × 1.20) = 25.00 + 3.00 = 28.00
    orderItems: [
      { productId: 'PD-1001', estimatedQuantity: 5, actualWeight: 2.5, price: 1.20, unit: 'KG' }, // 5 manzanas pesan 2.5 KG
      { productId: 'PD-1002', estimatedQuantity: 2, price: 12.50, unit: 'Unidad' },
    ]
  },
  { 
    id: '#ORD-002', 
    client: 'Supermercado El Sol', 
    rut: '98.123.456-K', 
    date: '24/10/2023', 
    items: 6, // 3 aguacates + 3 piñas = 6 items
    total: 6.00, // Total parcial: solo productos Unidad
    status: OrderStatus.PENDIENTE_ARMADO,
    estimatedTotal: 6.00, // Solo productos Unidad: 3 × $2.00 = $6.00
    orderItems: [
      { productId: 'PD-1003', estimatedQuantity: 3, price: 4.80, unit: 'KG' }, // 3 aguacates sin pesar
      { productId: 'PD-1004', estimatedQuantity: 3, price: 2.00, unit: 'Unidad' },
    ]
  },
  { 
    id: '#ORD-003', 
    client: 'Tienda Los Hermanos', 
    rut: '12.345.678-9', 
    date: '24/10/2023', 
    items: 12, // 2 sacos = 2 items
    total: 30.00, 
    status: OrderStatus.FACTURADO,
    estimatedTotal: 30.00, // Solo productos Unidad: 2 × $15.00 = $30.00
    actualTotal: 30.00, // No hay productos KG, total real = estimado
    orderItems: [
      { productId: 'PD-1005', estimatedQuantity: 2, price: 15.00, unit: 'Unidad' },
    ]
  },
  { 
    id: '#ORD-004', 
    client: 'Mini Market Apolo', 
    rut: '14.555.222-3', 
    date: '24/10/2023', 
    items: 8, // 3 manzanas + 5 piñas = 8 items
    total: 10.00, // Total parcial: solo productos Unidad
    status: OrderStatus.PENDIENTE_ARMADO,
    estimatedTotal: 10.00, // Solo productos Unidad: 5 × $2.00 = $10.00
    orderItems: [
      { productId: 'PD-1001', estimatedQuantity: 3, price: 1.20, unit: 'KG' }, // 3 manzanas sin pesar
      { productId: 'PD-1004', estimatedQuantity: 5, price: 2.00, unit: 'Unidad' },
    ]
  },
  { 
    id: '#ORD-005', 
    client: 'Bodega San Juan', 
    rut: '18.999.000-1', 
    date: '24/10/2023', 
    items: 3, // 1 aguacate + 2 bananos = 3 items
    total: 30.28, 
    status: OrderStatus.FACTURADO,
    estimatedTotal: 25.00, // Solo productos Unidad: 2 × $12.50 = $25.00
    actualTotal: 30.28, // Productos Unidad + productos KG: 25.00 + (1.1 × 4.80) = 25.00 + 5.28 = 30.28
    orderItems: [
      { productId: 'PD-1003', estimatedQuantity: 1, actualWeight: 1.1, price: 4.80, unit: 'KG' }, // 1 aguacate pesa 1.1 KG
      { productId: 'PD-1002', estimatedQuantity: 2, price: 12.50, unit: 'Unidad' },
    ]
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'PD-1001', name: 'Manzanas Royal Gala', emoji: '🍎', price: 1.20, unit: 'KG' },
  { id: 'PD-1002', name: 'Caja de Banano Premium', emoji: '🍌', price: 12.50, unit: 'Unidad' },
  { id: 'PD-1003', name: 'Aguacate Hass', emoji: '🥑', price: 4.80, unit: 'KG' },
  { id: 'PD-1004', name: 'Piña Golden', emoji: '🍍', price: 2.00, unit: 'Unidad' },
  { id: 'PD-1005', name: 'Saco de Papas (25kg)', emoji: '🥔', price: 15.00, unit: 'Unidad' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'CL-001', name: 'Distribuidora Central', initials: 'DC', address: 'Av. Libertador 1234, CABA', status: 'Activo' },
  { id: 'CL-002', name: 'Market Express', initials: 'ME', address: 'Calle Falsa 123, Springfield', status: 'Activo' },
  { id: 'CL-003', name: 'Supermercados Norte', initials: 'SN', address: 'Ruta 5 Km 40, Córdoba', status: 'Inactivo' },
  { id: 'CL-004', name: 'Almacén Doña Rosa', initials: 'AD', address: 'Calle 9 de Julio 550, Mendoza', status: 'Activo' },
  { id: 'CL-005', name: 'Tech Solutions Ltd', initials: 'TS', address: 'Av. Corrientes 2000, Rosario', status: 'Pendiente' },
];

export const INITIAL_USERS: User[] = [
  { id: 'U-001', name: 'Juan Pérez', email: 'juan@seguimiento.com', role: 'Admin', status: true, avatar: 'https://picsum.photos/seed/juan/100/100' },
  { id: 'U-002', name: 'Maria Lopez', email: 'maria@seguimiento.com', role: 'Vendedor', status: true, avatar: 'https://picsum.photos/seed/maria/100/100' },
  { id: 'U-003', name: 'Carlos Ruiz', email: 'carlos@seguimiento.com', role: 'Vendedor', status: false, avatar: 'https://picsum.photos/seed/carlos/100/100' },
  { id: 'U-004', name: 'Ana García', email: 'ana@seguimiento.com', role: 'Logística', status: true, avatar: 'https://picsum.photos/seed/ana/100/100' },
  { id: 'U-005', name: 'Pedro Martínez', email: 'pedro@seguimiento.com', role: 'Facturación', status: true, avatar: 'https://picsum.photos/seed/pedro/100/100' },
];

export const INITIAL_AUDIT: AuditEntry[] = [
  { id: 'A-001', user: 'Maria Garcia', role: 'Gerente de Logística', action: 'Cambio de Estado', reference: '#PED-1024', details: 'Estado actualizado de Pendiente a Enviado', date: '24 Oct 2023', time: '14:30:05' },
  { id: 'A-002', user: 'Carlos Rodriguez', role: 'Almacén', action: 'Creado', reference: '#INV-5502', details: 'Nuevo registro de inventario creado: 50 unidades.', date: '24 Oct 2023', time: '10:15:22' },
  { id: 'A-003', user: 'System Auto', role: 'Bot', action: 'Modificado', reference: '#CFG-SYS', details: 'Sincronización nocturna completada. Stock actualizado.', date: '23 Oct 2023', time: '23:00:00' },
];
