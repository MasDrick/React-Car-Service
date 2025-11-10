import type { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const statusLabels: Record<OrderStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  ready: 'Готов',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

const statusStyles: Record<OrderStatus, string> = {
  new: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  in_progress: 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30',
  ready: 'bg-purple-500/15 text-purple-500 border-purple-500/30',
  completed: 'bg-green-500/15 text-green-600 border-green-500/30',
  cancelled: 'bg-red-500/15 text-red-500 border-red-500/30',
};

export const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
};
