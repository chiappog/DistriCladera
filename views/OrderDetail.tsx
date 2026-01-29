
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrdersContext';
import { useProducts } from '../contexts/ProductsContext';
import { useClients } from '../contexts/ClientsContext';
import { useAuth } from '../hooks/useAuth';
import { useAudit } from '../contexts/AuditContext';
import StatusBadge from '../components/StatusBadge';
import WeightInputModal from '../components/WeightInputModal';
import ClientObservationsModal from '../components/ClientObservationsModal';
import { OrderStatus } from '../types';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, hasUnweighedKGProducts, changeOrderStatus, updateOrderWeights, updateOrder } = useOrders();
  const { products } = useProducts();
  const { clients } = useClients();
  const { user } = useAuth();
  const { addAuditEntry } = useAudit();
  const [weightModalOrder, setWeightModalOrder] = useState<{ order: any; targetStatus: OrderStatus } | null>(null);
  const [observationsModalOpen, setObservationsModalOpen] = useState(false);

  // Remover el # del ID si existe
  const orderId = id?.startsWith('#') ? id : `#${id}`;
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-4 py-12">
        <span className="material-symbols-outlined text-6xl text-slate-400">error_outline</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pedido no encontrado</h2>
        <p className="text-slate-500 dark:text-slate-400">El pedido {orderId} no existe.</p>
        <button
          onClick={() => navigate('/pedidos')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Volver a Pedidos
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!user) return;
    
    // Si se está cambiando a "Pendiente de Facturación" y hay productos KG sin pesar
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

  const handleConfirmWeights = (
    orderId: string,
    weights: { [productId: string]: number },
    targetStatus: OrderStatus,
    quantities?: { [productId: string]: number }
  ) => {
    if (!user) return;

    const currentOrder = orders.find(o => o.id === orderId);
    if (currentOrder && quantities && Object.keys(quantities).length > 0) {
      const newOrderItems = currentOrder.orderItems.map(item => {
        if (item.unit === 'KG' && quantities[item.productId] !== undefined) {
          return { ...item, estimatedQuantity: quantities[item.productId] };
        }
        return item;
      });
      const newItemsCount = newOrderItems.reduce((s, i) => s + i.estimatedQuantity, 0);
      updateOrder(orderId, { orderItems: newOrderItems, items: newItemsCount }, user.id, user.name, user.role);
    }

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

    setWeightModalOrder(null);

    changeOrderStatus(
      orderId,
      targetStatus,
      user.id,
      user.name,
      user.role,
      addAuditEntry
    );
  };

  const client = clients.find(c => c.name === order.client);

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/pedidos')}
          className="flex items-center justify-center size-10 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          title="Volver"
        >
          <span className="material-symbols-outlined text-[24px]">arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            {order.id}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Detalles del pedido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Información del Cliente */}
          <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Información del Cliente</h2>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Cliente</span>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{order.client}</p>
              </div>
              {order.rut && (
                <div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">RUT</span>
                  <p className="text-lg font-medium text-slate-900 dark:text-white">{order.rut}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Dirección</span>
                <p className="text-lg font-medium text-slate-900 dark:text-white">
                  {client?.address ?? '—'}
                </p>
              </div>
              <div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Fecha</span>
                <p className="text-lg font-medium text-slate-900 dark:text-white">{order.date}</p>
              </div>
              {client && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setObservationsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">notes</span>
                    Ver observaciones
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Productos del Pedido */}
          <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Productos del Pedido</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-slate-500 dark:text-slate-400">ID</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 dark:text-slate-400">Descripción</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 dark:text-slate-400">Cantidad</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 dark:text-slate-400">Precio por unidad/KG</th>
                    <th className="px-6 py-3 font-semibold text-slate-500 dark:text-slate-400 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {order.orderItems.map((item, index) => {
                    const productInfo = products.find(p => p.id === item.productId);
                    
                    const quantity = item.unit === 'KG' 
                      ? (item.actualWeight !== undefined && item.actualWeight !== null ? item.actualWeight : item.estimatedQuantity)
                      : item.estimatedQuantity;
                    
                    const subtotal = item.unit === 'KG' && item.actualWeight !== undefined && item.actualWeight !== null
                      ? item.actualWeight * item.price
                      : item.unit === 'Unidad'
                      ? item.estimatedQuantity * item.price
                      : 0;

                    const quantityFormatted = quantity.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                    const quantityUnitLabel = item.unit === 'KG' ? 'kg' : 'unidades';
                    const priceUnitLabel = item.unit === 'KG' ? 'kg' : 'unidad';

                    return (
                      <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono font-semibold text-slate-900 dark:text-white">{item.productId}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{productInfo?.name ?? '—'}</p>
                            {productInfo?.brand && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">{productInfo.brand}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-white">
                              {quantityFormatted} {quantityUnitLabel}
                            </span>
                            {item.unit === 'KG' && item.actualWeight === undefined && (
                              <span className="text-xs text-amber-600 dark:text-amber-400">Pendiente pesaje</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          ${item.price.toLocaleString('es-ES', { minimumFractionDigits: 2 })} / {priceUnitLabel}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                          ${subtotal.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel Lateral */}
        <div className="flex flex-col gap-6">
          {/* Estado y Resumen */}
          <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Estado</h2>
            <StatusBadge
              status={order.status}
              orderId={order.id}
              onStatusChange={handleStatusChange}
            />
          </div>

          {/* Resumen Financiero */}
          <div className="bg-white dark:bg-[#1a2634] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Resumen</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Items</span>
                <span className="font-semibold text-slate-900 dark:text-white">{order.items} items</span>
              </div>
              {order.actualTotal !== undefined && order.actualTotal !== null ? (
                <>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${order.actualTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Total real</p>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${order.estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {hasUnweighedKGProducts(order) ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Total parcial - Pendiente pesaje</p>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total estimado</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {weightModalOrder && (
        <WeightInputModal
          isOpen={true}
          onClose={() => setWeightModalOrder(null)}
          order={weightModalOrder.order}
          products={products}
          onConfirm={(weights, quantities) => handleConfirmWeights(weightModalOrder.order.id, weights, weightModalOrder.targetStatus, quantities)}
        />
      )}

      <ClientObservationsModal
        isOpen={observationsModalOpen}
        onClose={() => setObservationsModalOpen(false)}
        clientName={order.client}
        notes={client?.notes}
      />
    </div>
  );
};

export default OrderDetail;
