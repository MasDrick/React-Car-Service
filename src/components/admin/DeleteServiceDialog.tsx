import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { deleteService } from '@/store/slices/servicesSlice';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Service } from '@/types';

type DeleteServiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  onSuccess?: () => void;
};

export const DeleteServiceDialog = ({
  open,
  onOpenChange,
  service,
  onSuccess,
}: DeleteServiceDialogProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteService(service.id)).unwrap();
      onSuccess?.();
      onOpenChange(false);
    } catch (err) {
      console.error('Ошибка удаления услуги:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить услугу?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить услугу &quot;{service.name}&quot;? Это действие нельзя
            отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
