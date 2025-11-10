import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServices } from '@/store/slices/servicesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ServiceFormDialog } from './ServiceFormDialog';
import { DeleteServiceDialog } from './DeleteServiceDialog';
import { formatPrice, formatDuration } from '@/lib/utils';
import type { Service } from '@/types';

export const ServicesTab = () => {
  const dispatch = useAppDispatch();
  const { services, isLoading, error } = useAppSelector(state => state.services);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = (service: Service) => {
    setDeletingService(service);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    dispatch(fetchServices());
  };

  const handleUpdateSuccess = () => {
    setEditingService(null);
    dispatch(fetchServices());
  };

  const handleDeleteSuccess = () => {
    setDeletingService(null);
    dispatch(fetchServices());
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с кнопкой */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Управление услугами</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить услугу
        </Button>
      </div>

      {/* Ошибки */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Таблица услуг */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-muted-foreground">Загрузка услуг...</div>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Услуги пока не добавлены</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Список всех услуг</TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[60px]">№</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Длительность</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.id}</TableCell>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{formatPrice(service.price)}</TableCell>
                  <TableCell>{formatDuration(service.duration)}</TableCell>
                  <TableCell className="max-w-[300px] text-muted-foreground">
                    {service.description ? (
                      <span className="line-clamp-2">{service.description}</span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(service)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Диалоги */}
      <ServiceFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
      {editingService && (
        <ServiceFormDialog
          open={!!editingService}
          onOpenChange={open => !open && setEditingService(null)}
          service={editingService}
          onSuccess={handleUpdateSuccess}
        />
      )}
      {deletingService && (
        <DeleteServiceDialog
          open={!!deletingService}
          onOpenChange={open => !open && setDeletingService(null)}
          service={deletingService}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};
