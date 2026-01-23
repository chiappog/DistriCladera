
import React, { useState } from 'react';
import { useOrders } from '../contexts/OrdersContext';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';
import { useAudit } from '../contexts/AuditContext';
import { OrderStatus } from '../types.ts';
import NewOrderModal from '../components/NewOrderModal';
import StatusBadge from '../components/StatusBadge';
import WeightInputModal from '../components/WeightInputModal';

const Orders: React.FC = () => {
  const { orders, changeOrderStatus, updateOrderWeights, hasUnweighedKGProducts, products, deleteOrder } = useOrders();
  const { canCreateOrder, canEditOrder, canDeleteOrder } = usePermissions();
  const { user } = useAuth();
  const { addAuditEntry } = useAudit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weightModalOrder, setWeightModalOrder] = useState<{ order: any; targetStatus: OrderStatus } | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!user) return;
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Si Logística está cambiando a "Pendiente de Facturación" y hay productos KG sin pesar
    if (newStatus === OrderStatus.PENDIENTE_FACTURACION && hasUnweighedKGProducts(order)) {
      // Mostrar modal de ingreso de peso primero
      setWeightModalOrder({ order, targetStatus: newStatus });
      return;
    }

    // Cambio de estado normal
    const success = changeOrderStatus(
      orderId,
      newStatus,
      user.id,
      user.name,
      user.role,
      addAuditEntry
    );

    if (!success) {
      alert('No se pudo cambiar el estado. Verifica tus permisos.');
    }
  };

  const handleConfirmWeights = (orderId: string, weights: { [productId: string]: number }, targetStatus: OrderStatus) => {
    if (!user) return;

    // Actualizar pesos
    const success = updateOrderWeights(
      orderId,
      weights,
      user.id,
      user.name,
      user.role,
      addAuditEntry
    );

    if (!success) {
      alert('No se pudieron actualizar los pesos.');
      return;
    }

    // Cerrar modal de peso
    setWeightModalOrder(null);

    // Cambiar estado después de actualizar pesos
    changeOrderStatus(
      orderId,
      targetStatus,
      user.id,
      user.name,
      user.role,
      addAuditEntry
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    if (!user) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Confirmar eliminación
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el pedido ${orderId}?\n\nCliente: ${order.client}\nEsta acción no se puede deshacer.`)) {
      return;
    }

    deleteOrder(
      orderId,
      user.id,
      user.name,
      user.role,
      addAuditEntry
    );
  };
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Pedidos Diarios</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Gestiona y supervisa las órdenes del día.</p>
        </div>
        {canCreateOrder() && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/30 transition-all gap-2 text-sm font-bold active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span>Nuevo Pedido</span>
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#1a2634] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center">
          <label className="flex flex-col flex-1 w-full lg:max-w-xs">
            <span className="text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Fecha de Orden</span>
            <input 
              className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white h-11 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" 
              type="date" 
              defaultValue="2023-10-24" 
            />
          </label>
          <label className="flex flex-col flex-1 w-full">
            <span className="text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Buscar Cliente o ID</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
              <input 
                className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white h-11 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder:text-gray-400" 
                placeholder="Ej: Supermercado El Sol, #ORD-001" 
                type="text" 
              />
            </div>
          </label>
          <label className="flex flex-col flex-1 w-full lg:max-w-xs">
            <span className="text-slate-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Estado</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">filter_list</span>
              <select className="w-full rounded-lg border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 text-slate-900 dark:text-white h-11 pl-10 pr-8 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm appearance-none cursor-pointer">
                <option value="">Todos los estados</option>
                <option value="armado">Pendiente de Armado</option>
                <option value="facturacion">Pendiente de Facturación</option>
                <option value="facturado">Facturado</option>
                <option value="entregado">Entregado</option>
              </select>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 px-4 transition-colors">
          <span className="text-slate-900 dark:text-white text-sm font-medium">Todos</span>
          <span className="bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 text-xs font-bold px-1.5 py-0.5 rounded-md">62</span>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 px-4 hover:bg-orange-100 transition-colors">
          <span className="text-orange-700 dark:text-orange-400 text-sm font-medium">Pendiente de Armado</span>
          <span className="bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-bold px-1.5 py-0.5 rounded-md">12</span>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 px-4 hover:bg-blue-100 transition-colors">
          <span className="text-blue-700 dark:text-blue-400 text-sm font-medium">Pendiente de Facturación</span>
          <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs font-bold px-1.5 py-0.5 rounded-md">5</span>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 px-4 hover:bg-emerald-100 transition-colors">
          <span className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Facturado</span>
          <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold px-1.5 py-0.5 rounded-md">45</span>
        </button>
        <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/30 px-4 hover:bg-teal-100 transition-colors">
          <span className="text-teal-700 dark:text-teal-400 text-sm font-medium">Entregado</span>
          <span className="bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold px-1.5 py-0.5 rounded-md">38</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1a2634] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-gray-800/50 border-b border-slate-200 dark:border-gray-800">
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 whitespace-nowrap">ID Pedido</th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 whitespace-nowrap">Cliente</th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 whitespace-nowrap">Fecha</th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 whitespace-nowrap">Items</th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 whitespace-nowrap">Total</th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 whitespace-nowrap">Estado</th>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-gray-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
              {orders.map((order) => (
                <tr key={order.id} className="group hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4 text-primary font-medium">{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{order.client}</div>
                    <div className="text-xs text-slate-400">{order.rut}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-gray-400">{order.date}</td>
                  <td className="px-6 py-4 text-slate-900 dark:text-white">{order.items} items</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-end">
                      {order.actualTotal !== undefined && order.actualTotal !== null ? (
                        <>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            ${order.actualTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Total real
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            ${order.estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                          {hasUnweighedKGProducts(order) ? (
                            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                              Total parcial - Pendiente pesaje
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              Total estimado
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      status={order.status}
                      orderId={order.id}
                      onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="inline-flex items-center justify-center size-8 rounded hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-400 transition-colors" title="Ver detalles">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                      {canEditOrder(order.status) && (
                        <button className="inline-flex items-center justify-center size-8 rounded hover:bg-primary/10 dark:hover:bg-primary/20 text-slate-400 hover:text-primary transition-colors" title="Editar">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                      )}
                      {canDeleteOrder(order.status) && (
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="inline-flex items-center justify-center size-8 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors" 
                          title="Eliminar"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-800 px-6 py-4">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-semibold text-slate-900 dark:text-white">1-5</span> de <span className="font-semibold text-slate-900 dark:text-white">62</span> resultados
          </p>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-gray-700 disabled:opacity-50" disabled>
              Anterior
            </button>
            <button className="flex items-center justify-center rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-gray-700">
              Siguiente
            </button>
          </div>
        </div>
      </div>
      
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {weightModalOrder && (
        <WeightInputModal
          isOpen={true}
          onClose={() => setWeightModalOrder(null)}
          order={weightModalOrder.order}
          products={products}
          onConfirm={(weights) => handleConfirmWeights(weightModalOrder.order.id, weights, weightModalOrder.targetStatus)}
        />
      )}
    </div>
  );
};

export default Orders;
