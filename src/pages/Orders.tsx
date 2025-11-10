import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchOrders } from '@/store/slices/ordersSlice';
import { PageLayout } from '@/components/PageLayout';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/OrderStatusBadge';

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, isLoading, error } = useAppSelector(state => state.orders);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const userOrders = useMemo(() => orders.filter(o => o.user_id === user?.id), [orders, user?.id]);

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Мои заказы</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Загрузка заказов...</div>
        </div>
      ) : userOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">У вас пока нет заказов</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full border border-border rounded-lg overflow-hidden">
            <TableCaption>История ваших записей на обслуживание</TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px]">№</TableHead>
                <TableHead>Услуга</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead>Комментарий</TableHead>
                <TableHead className="text-right">Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.service_name}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-[220px] text-muted-foreground">
                    {order.notes ? <span className="line-clamp-2">{order.notes}</span> : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageLayout>
  );
};

export default Orders;
