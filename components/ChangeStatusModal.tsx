import React, { useState } from 'react';
import { OrderStatus } from '../types';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../hooks/useAuth';

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  orderId: string;
  onStatusChange: (newStatus: OrderStatus) => void;
}

const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  orderId,
  onStatusChange,
}) => {
  const { getAvailableStatusTransitions } = usePermissions();
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string>('');

  const availableTransitions = getAvailableStatusTransitions(currentStatus);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedStatus(null);
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      setError('Debes seleccionar un nuevo estado');
      return;
    }

    if (!user) {
      setError('No hay usuario autenticado');
      return;
    }

    onStatusChange(selectedStatus);
    onClose();
  };

  if (!isOpen) return null;

  const getStatusLabel = (status: OrderStatus): string => {
    return status;
  };

  const getStatusColorClasses = (status: OrderStatus, isSelected: boolean = false) => {
    switch (status) {
      case OrderStatus.PENDIENTE_ARMADO:
        return {
          border: isSelected ? 'border-orange-500' : 'border-slate-200 dark:border-slate-700',
          bg: isSelected ? 'bg-orange-50 dark:bg-orange-900/20' : '',
          dot: 'bg-orange-500',
        };
      case OrderStatus.PENDIENTE_FACTURACION:
        return {
          border: isSelected ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700',
          bg: isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : '',
          dot: 'bg-blue-500',
        };
      case OrderStatus.FACTURADO:
        return {
          border: isSelected ? 'border-emerald-500' : 'border-slate-200 dark:border-slate-700',
          bg: isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : '',
          dot: 'bg-emerald-500',
        };
      case OrderStatus.ENTREGADO:
        return {
          border: isSelected ? 'border-teal-500' : 'border-slate-200 dark:border-slate-700',
          bg: isSelected ? 'bg-teal-50 dark:bg-teal-900/20' : '',
          dot: 'bg-teal-500',
        };
      default:
        return {
          border: isSelected ? 'border-slate-500' : 'border-slate-200 dark:border-slate-700',
          bg: isSelected ? 'bg-slate-50 dark:bg-slate-900/20' : '',
          dot: 'bg-slate-500',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#1a2634] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cambiar Estado del Pedido</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 p-6">
          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Pedido
            </label>
            <p className="text-slate-900 dark:text-white font-medium">{orderId}</p>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Estado Actual
            </label>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${
              currentStatus === OrderStatus.PENDIENTE_ARMADO ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' :
              currentStatus === OrderStatus.PENDIENTE_FACTURACION ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
              currentStatus === OrderStatus.FACTURADO ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' :
              'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300'
            }`}>
              <span className={`h-2 w-2 rounded-full ${
                currentStatus === OrderStatus.PENDIENTE_ARMADO ? 'bg-orange-500' :
                currentStatus === OrderStatus.PENDIENTE_FACTURACION ? 'bg-blue-500' :
                currentStatus === OrderStatus.FACTURADO ? 'bg-emerald-500' :
                'bg-teal-500'
              }`}></span>
              <span className="font-medium">{getStatusLabel(currentStatus)}</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
              Nuevo Estado <span className="text-red-500">*</span>
            </label>
            {availableTransitions.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No hay transiciones disponibles para este estado con tu rol actual.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableTransitions.map((status) => {
                  const isSelected = selectedStatus === status;
                  const colors = getStatusColorClasses(status, isSelected);
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(status);
                        setError('');
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${colors.border} ${colors.bg}`
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? `${colors.border} ${colors.dot}`
                              : 'border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          {isSelected && (
                            <span className="material-symbols-outlined text-white text-xs">check</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span className={`h-2 w-2 rounded-full ${colors.dot}`}></span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {getStatusLabel(status)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={availableTransitions.length === 0 || !selectedStatus}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cambiar Estado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
