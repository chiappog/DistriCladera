import React, { useState } from 'react';
import { OrderStatus } from '../types';
import { usePermissions } from '../hooks/usePermissions';
import ChangeStatusModal from './ChangeStatusModal';

interface StatusBadgeProps {
  status: OrderStatus;
  orderId: string;
  onStatusChange: (newStatus: OrderStatus) => void;
  showChangeButton?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  orderId,
  onStatusChange,
  showChangeButton = true,
}) => {
  const { canChangeOrderStatus } = usePermissions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canChange = canChangeOrderStatus(status);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDIENTE_ARMADO:
        return {
          bg: 'bg-orange-50 dark:bg-orange-900/30',
          text: 'text-orange-700 dark:text-orange-300',
          border: 'border-orange-100 dark:border-orange-800',
          dot: 'bg-orange-500',
        };
      case OrderStatus.PENDIENTE_FACTURACION:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-300',
          border: 'border-blue-100 dark:border-blue-800',
          dot: 'bg-blue-500',
        };
      case OrderStatus.FACTURADO:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-900/30',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-100 dark:border-emerald-800',
          dot: 'bg-emerald-500',
        };
      case OrderStatus.ENTREGADO:
        return {
          bg: 'bg-teal-50 dark:bg-teal-900/30',
          text: 'text-teal-700 dark:text-teal-300',
          border: 'border-teal-100 dark:border-teal-800',
          dot: 'bg-teal-500',
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/30',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-100 dark:border-slate-800',
          dot: 'bg-slate-500',
        };
    }
  };

  const colors = getStatusColor(status);

  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          <span className={`size-1.5 rounded-full ${colors.dot}`}></span>
          {status}
        </span>
        {showChangeButton && canChange && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-slate-400 hover:text-primary transition-colors p-1 rounded"
            title="Cambiar estado"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        )}
      </div>

      <ChangeStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentStatus={status}
        orderId={orderId}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

export default StatusBadge;
