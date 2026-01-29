import { UserRole, OrderStatus } from '../types';

/**
 * Verifica si un rol puede crear pedidos
 */
export const canCreateOrder = (role: UserRole): boolean => {
  return role === 'Admin' || role === 'Vendedor';
};

/**
 * Verifica si un rol puede editar un pedido según su estado
 */
export const canEditOrder = (role: UserRole, status: OrderStatus): boolean => {
  if (role === 'Admin') return true;
  if (role === 'Vendedor') {
    // Vendedor solo puede editar si NO está facturado ni entregado
    return status !== OrderStatus.FACTURADO && status !== OrderStatus.ENTREGADO;
  }
  return false;
};

/**
 * Verifica si un rol puede eliminar un pedido según su estado
 */
export const canDeleteOrder = (role: UserRole, status: OrderStatus): boolean => {
  if (role === 'Admin') return true;
  if (role === 'Vendedor') {
    // Vendedor solo puede eliminar si NO está facturado ni entregado
    return status !== OrderStatus.FACTURADO && status !== OrderStatus.ENTREGADO;
  }
  return false;
};

/**
 * Verifica si un rol puede cambiar de un estado a otro
 */
export const canChangeStatus = (
  role: UserRole,
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean => {
  if (role === 'Admin') return true;

  // Logística puede cambiar: Pendiente de Armado <-> Pendiente de Facturación
  if (role === 'Logística') {
    if (currentStatus === OrderStatus.PENDIENTE_ARMADO && 
        newStatus === OrderStatus.PENDIENTE_FACTURACION) {
      return true;
    }
    // Logística puede revertir: Pendiente de Facturación -> Pendiente de Armado
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION && 
        newStatus === OrderStatus.PENDIENTE_ARMADO) {
      return true;
    }
    // Logística puede cambiar: Facturado -> Entregado
    if (currentStatus === OrderStatus.FACTURADO && 
        newStatus === OrderStatus.ENTREGADO) {
      return true;
    }
    // Logística puede revertir: Entregado -> Facturado
    if (currentStatus === OrderStatus.ENTREGADO && 
        newStatus === OrderStatus.FACTURADO) {
      return true;
    }
    return false;
  }

  // Facturación puede cambiar: Pendiente de Facturación <-> Facturado
  if (role === 'Facturación') {
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION && 
        newStatus === OrderStatus.FACTURADO) {
      return true;
    }
    // Facturación puede revertir: Facturado -> Pendiente de Facturación
    if (currentStatus === OrderStatus.FACTURADO && 
        newStatus === OrderStatus.PENDIENTE_FACTURACION) {
      return true;
    }
    return false;
  }

  return false;
};

/**
 * Obtiene los estados disponibles a los que se puede cambiar desde el estado actual
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
    // Admin puede cambiar a cualquier estado, incluyendo revertir desde Entregado
    return allStatuses.filter(s => s !== currentStatus);
  }

  const available: OrderStatus[] = [];

  if (role === 'Logística') {
    if (currentStatus === OrderStatus.PENDIENTE_ARMADO) {
      available.push(OrderStatus.PENDIENTE_FACTURACION);
    }
    // Logística puede revertir: Pendiente de Facturación -> Pendiente de Armado
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION) {
      available.push(OrderStatus.PENDIENTE_ARMADO);
    }
    if (currentStatus === OrderStatus.FACTURADO) {
      available.push(OrderStatus.ENTREGADO);
    }
    // Logística puede revertir: Entregado -> Facturado
    if (currentStatus === OrderStatus.ENTREGADO) {
      available.push(OrderStatus.FACTURADO);
    }
  }

  if (role === 'Facturación') {
    if (currentStatus === OrderStatus.PENDIENTE_FACTURACION) {
      available.push(OrderStatus.FACTURADO);
    }
    // Facturación puede revertir: Facturado -> Pendiente de Facturación
    if (currentStatus === OrderStatus.FACTURADO) {
      available.push(OrderStatus.PENDIENTE_FACTURACION);
    }
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
