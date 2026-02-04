import { UserRole, OrderStatus } from '../types';

/**
 * Matriz de permisos - Crear pedido: Vendedor ✅, Logística ❌, Facturación ✅, Admin ✅
 */
export const canCreateOrder = (role: UserRole): boolean => {
  return role === 'Admin' || role === 'Vendedor' || role === 'Facturación';
};

/**
 * Matriz de permisos - Editar pedido (no facturado): Vendedor ✅, Logística ✅, Facturación ❌, Admin ✅
 */
export const canEditOrder = (role: UserRole, status: OrderStatus): boolean => {
  if (role === 'Admin') return true;
  if (role === 'Facturación') return false;
  if (role === 'Vendedor' || role === 'Logística') {
    return status !== OrderStatus.FACTURADO && status !== OrderStatus.ENTREGADO;
  }
  return false;
};

/**
 * Matriz de permisos - Eliminar pedido (no facturado): Vendedor ✅, Logística ❌, Facturación ❌, Admin ✅
 */
export const canDeleteOrder = (role: UserRole, status: OrderStatus): boolean => {
  if (role === 'Admin') return true;
  if (role === 'Vendedor') {
    return status !== OrderStatus.FACTURADO && status !== OrderStatus.ENTREGADO;
  }
  return false;
};

/**
 * Matriz de permisos - Cambios de estado:
 * - Pendiente Facturación: Solo Logística, Admin
 * - Facturado: Solo Facturación, Admin
 * - Entregado: Solo Logística, Admin
 */
export const canChangeStatus = (
  role: UserRole,
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  if (role === 'Admin') return true;
  if (role === 'Vendedor') return false;

  // Logística: Pendiente Armado <-> Pendiente Facturación; Facturado <-> Entregado
  if (role === 'Logística') {
    if (currentStatus === OrderStatus.PENDIENTE_ARMADO && newStatus === OrderStatus.PENDIENTE_FACTURACION) return true;
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION && newStatus === OrderStatus.PENDIENTE_ARMADO) return true;
    if (currentStatus === OrderStatus.FACTURADO && newStatus === OrderStatus.ENTREGADO) return true;
    if (currentStatus === OrderStatus.ENTREGADO && newStatus === OrderStatus.FACTURADO) return true;
    return false;
  }

  // Facturación: Solo Pendiente Facturación <-> Facturado
  if (role === 'Facturación') {
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION && newStatus === OrderStatus.FACTURADO) return true;
    if (currentStatus === OrderStatus.FACTURADO && newStatus === OrderStatus.PENDIENTE_FACTURACION) return true;
    return false;
  }

  return false;
};

/**
 * Obtiene los estados disponibles a los que se puede cambiar desde el estado actual
 * según la matriz de permisos
 */
export const getAvailableStatusTransitions = (
  role: UserRole,
  currentStatus: OrderStatus
): OrderStatus[] => {
  const allStatuses = [
    OrderStatus.PENDIENTE_ARMADO,
    OrderStatus.PENDIENTE_FACTURACION,
    OrderStatus.FACTURADO,
    OrderStatus.ENTREGADO,
  ];

  if (role === 'Admin') {
    return allStatuses.filter(s => s !== currentStatus);
  }

  const available: OrderStatus[] = [];

  if (role === 'Logística') {
    if (currentStatus === OrderStatus.PENDIENTE_ARMADO) available.push(OrderStatus.PENDIENTE_FACTURACION);
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION) available.push(OrderStatus.PENDIENTE_ARMADO);
    if (currentStatus === OrderStatus.FACTURADO) available.push(OrderStatus.ENTREGADO);
    if (currentStatus === OrderStatus.ENTREGADO) available.push(OrderStatus.FACTURADO);
  }

  if (role === 'Facturación') {
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION) available.push(OrderStatus.FACTURADO);
    if (currentStatus === OrderStatus.FACTURADO) available.push(OrderStatus.PENDIENTE_FACTURACION);
  }

  return available;
};

/**
 * Verifica si un rol puede cambiar el estado de un pedido (cualquier cambio)
 */
export const canChangeOrderStatus = (role: UserRole, currentStatus: OrderStatus): boolean => {
  const transitions = getAvailableStatusTransitions(role, currentStatus);
  return transitions.length > 0;
};

/**
 * Verifica si un rol puede marcar/desmarcar el checkbox de logística (artículo listo)
 */
export const canToggleLogisticsCheck = (role: UserRole): boolean => {
  return role === 'Logística' || role === 'Admin';
};

/**
 * Verifica si un rol puede marcar/desmarcar el checkbox de facturación (artículo facturado)
 */
export const canToggleFacturacionCheck = (role: UserRole): boolean => {
  return role === 'Facturación' || role === 'Admin';
};

/**
 * Verifica si un rol puede marcar/desmarcar el checkbox de admin (verificado)
 */
export const canToggleAdminCheck = (role: UserRole): boolean => {
  return role === 'Admin';
};
