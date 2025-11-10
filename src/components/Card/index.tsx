import { Clock, DollarSign } from 'lucide-react';
import { formatDuration, formatPrice } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button';
import { ServiceBookingDialog } from '@/components/ServiceBookingDialog';
import type { Service } from '@/types';
import { useState } from 'react';
import { ServiceFormDialog } from '@/components/admin/ServiceFormDialog.tsx';
import { DeleteServiceDialog } from '@/components/admin/DeleteServiceDialog.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { fetchServices } from '@/store/slices/servicesSlice.ts';
import { useAppDispatch } from '@/store/hooks.ts';

type CardProps = {
  service: Service;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
};

const Card = ({ service, isAdmin = false, isAuthenticated }: CardProps) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  console.log(isAuthenticated);

  const dispatch = useAppDispatch();

  const handleEdit = (service: Service) => {
    setEditingService(service);
  };

  const handleDelete = (service: Service) => {
    setDeletingService(service);
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
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="group bg-card text-card-foreground rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-ring/50 flex flex-col h-full">
            <div className="relative overflow-hidden bg-muted">
              <img
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                src={service.img}
                alt={service.name}
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold text-card-foreground mb-2 line-clamp-2">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-muted-foreground mb-4 text-sm line-clamp-2 flex-1">
                  {service.description}
                </p>
              )}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center text-card-foreground">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 shrink-0" />
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary shrink-0" />
                  <span>{formatDuration(service.duration)}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                {!isAdmin && (
                  <ServiceBookingDialog service={service} isAuthenticated={isAuthenticated} />
                )}
                {isAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(service)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDelete(service)}
                    >
                      Удалить
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        {!isAuthenticated && (
          <TooltipContent side="top" className="text-center">
            <p className="text-sm">Для записи на услугу необходимо войти в систему</p>
          </TooltipContent>
        )}
      </Tooltip>

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
    </>
  );
};

export default Card;
