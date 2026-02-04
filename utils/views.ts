import { UserRole } from '../types';

/**
 * Claves de vistas disponibles en la aplicación.
 * Corresponden a las rutas principales.
 */
export type ViewKey =
  | 'dashboard'   // Panel general - /
  | 'products'    // Productos - /productos
  | 'clients'     // Clientes - /clientes
  | 'orders'      // Pedidos - /pedidos
  | 'users'       // Usuarios - /usuarios
  | 'audit';      // Auditoría - /auditoria

/**
 * Matriz de vistas por rol:
 * - Panel general: Vendedor ✅, Logística ❌, Facturación ✅, Admin ✅
 * - Productos: Vendedor ✅, Logística ❌, Facturación ✅, Admin ✅
 * - Clientes: Vendedor ✅, Logística ❌, Facturación ✅, Admin ✅
 * - Pedidos: Vendedor ✅, Logística ✅, Facturación ✅, Admin ✅
 * - Usuarios: Vendedor ❌, Logística ❌, Facturación ❌, Admin ✅
 * - Auditoría: Vendedor ❌, Logística ❌, Facturación ❌, Admin ✅
 */
const VIEW_MATRIX: Record<ViewKey, Record<UserRole, boolean>> = {
  dashboard: {
    Admin: true,
    Vendedor: true,
    'Logística': false,
    'Facturación': true,
  },
  products: {
    Admin: true,
    Vendedor: true,
    'Logística': false,
    'Facturación': true,
  },
  clients: {
    Admin: true,
    Vendedor: true,
    'Logística': false,
    'Facturación': true,
  },
  orders: {
    Admin: true,
    Vendedor: true,
    'Logística': true,
    'Facturación': true,
  },
  users: {
    Admin: true,
    Vendedor: false,
    'Logística': false,
    'Facturación': false,
  },
  audit: {
    Admin: true,
    Vendedor: false,
    'Logística': false,
    'Facturación': false,
  },
};

/**
 * Verifica si un rol puede acceder a una vista determinada.
 */
export const canAccessView = (role: UserRole, view: ViewKey): boolean => {
  return VIEW_MATRIX[view][role] ?? false;
};

/**
 * Mapeo de rutas a claves de vista para verificación de acceso.
 */
export const PATH_TO_VIEW: Record<string, ViewKey> = {
  '/': 'dashboard',
  '/productos': 'products',
  '/clientes': 'clients',
  '/pedidos': 'orders',
  '/usuarios': 'users',
  '/auditoria': 'audit',
};

/**
 * Obtiene la clave de vista para una ruta.
 * Para rutas como /pedidos/123, devuelve 'orders'.
 */
export const getViewFromPath = (pathname: string): ViewKey | null => {
  const normalized = pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
  
  if (PATH_TO_VIEW[normalized]) {
    return PATH_TO_VIEW[normalized];
  }
  if (normalized.startsWith('/pedidos')) {
    return 'orders';
  }
  return null;
};

/**
 * Ruta por defecto para cada rol cuando no tiene acceso a la ruta solicitada.
 * Logística solo ve Pedidos, por lo que su ruta por defecto es /pedidos.
 */
export const getDefaultRouteForRole = (role: UserRole): string => {
  if (role === 'Logística') return '/pedidos';
  return '/';
};
