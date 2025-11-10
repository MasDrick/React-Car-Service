import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrders, updateOrderStatus } from '@/store/slices/ordersSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CancelOrderDialog } from '@/components/CancelOrderDialog';
import { Search, Filter } from 'lucide-react';
import type { OrderStatus } from '@/types';

export const OrdersTab = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    let filtered = [...orders];

    // Фильтр по статусу
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Фильтр по дате
    if (dateFilter) {
      const filterDate = new Date(dateFilter).toISOString().split('T')[0];
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === filterDate;
      });
    }

    // Поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.id.toString().includes(query) ||
          order.service_name.toLowerCase().includes(query) ||
          order.user_id.toString().includes(query)
      );
    }

    return filtered;
  }, [orders, statusFilter, dateFilter, searchQuery]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      if (newStatus === 'cancelled') {
        // Открываем диалог подтверждения для отмены
        setCancelOrderId(orderId);
      } else {
        // Меняем статус напрямую для других статусов
        await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      }
    } catch (err) {
      console.error('Ошибка обновления статуса:', err);
    }
  };

  const handleCancelConfirm = async () => {
    if (cancelOrderId) {
      setIsCancelling(true);
      try {
        await dispatch(updateOrderStatus({ id: cancelOrderId, status: 'cancelled' })).unwrap();
        setCancelOrderId(null);
      } catch (err) {
        console.error('Ошибка отмены заказа:', err);
      } finally {
        setIsCancelling(false);
      }
    }
  };

  const isOrderCancelled = (status: string): boolean => status === 'cancelled';

  return (
    <div className="space-y-6">
      {/* Фильтры и поиск */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по номеру, услуге, клиенту..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-full sm:w-[180px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
          <Select
            value={statusFilter}
            onValueChange={value => setStatusFilter(value as OrderStatus | 'all')}
          >
            <SelectTrigger className="w-full pl-9">
              <SelectValue placeholder="Статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новый</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="ready">Готов</SelectItem>
              <SelectItem value="completed">Завершён</SelectItem>
              <SelectItem value="cancelled">Отменён</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="w-full sm:w-[180px]"
        />
      </div>

      {/* Ошибки */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Таблица заказов */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Загрузка заказов...</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {searchQuery || statusFilter !== 'all' || dateFilter
            ? 'Заказы не найдены'
            : 'Заказов пока нет'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Все заказы в системе</TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px]">№</TableHead>
                <TableHead>Клиент (ID)</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Дата записи</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead>Комментарий</TableHead>
                <TableHead className="text-center">Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map(order => {
                const cancelled = isOrderCancelled(order.status);

                return (
                  <TableRow
                    key={order.id}
                    className={cancelled ? 'bg-muted/30 text-muted-foreground' : ''}
                  >
                    <TableCell
                      className={`font-medium ${cancelled ? 'text-muted-foreground' : ''}`}
                    >
                      {order.id}
                    </TableCell>
                    <TableCell className={cancelled ? 'text-muted-foreground' : ''}>
                      #{order.user_id}
                    </TableCell>
                    <TableCell className={cancelled ? 'text-muted-foreground' : ''}>
                      {order.service_name}
                    </TableCell>
                    <TableCell className={cancelled ? 'text-muted-foreground' : ''}>
                      {new Date(order.date).toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell
                      className={cancelled ? 'text-muted-foreground' : 'text-muted-foreground'}
                    >
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </TableCell>
                    <TableCell
                      className={`max-w-[200px] ${cancelled ? 'text-muted-foreground' : 'text-muted-foreground'}`}
                    >
                      {order.notes ? <span className="line-clamp-2">{order.notes}</span> : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={order.status}
                        onValueChange={value => handleStatusChange(order.id, value as OrderStatus)}
                        disabled={cancelled}
                      >
                        <SelectTrigger
                          className={`w-[140px] ${cancelled ? 'bg-muted/50 border-muted-foreground/30' : ''}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new" disabled={cancelled}>
                            Новый
                          </SelectItem>
                          <SelectItem value="in_progress" disabled={cancelled}>
                            В работе
                          </SelectItem>
                          <SelectItem value="ready" disabled={cancelled}>
                            Готов
                          </SelectItem>
                          <SelectItem value="completed" disabled={cancelled}>
                            Завершён
                          </SelectItem>
                          <SelectItem value="cancelled" disabled={cancelled}>
                            Отменён
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Диалог отмены заказа */}
      <CancelOrderDialog
        open={!!cancelOrderId}
        onOpenChange={open => !open && setCancelOrderId(null)}
        onConfirm={handleCancelConfirm}
        orderId={cancelOrderId}
        isLoading={isCancelling}
      />
    </div>
  );
};
