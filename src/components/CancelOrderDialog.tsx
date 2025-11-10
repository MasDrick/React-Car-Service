import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

type CancelOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  orderId?: number | null;
  isLoading?: boolean;
};

export const CancelOrderDialog = ({
  open,
  onOpenChange,
  onConfirm,
  orderId,
  isLoading = false,
}: CancelOrderDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg">Отмена заказа</DialogTitle>
              <DialogDescription className="mt-1">
                Вы уверены, что хотите отменить заказ №{orderId}?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              Это действие нельзя будет отменить. Заказ будет помечен как отменённый.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            <p className="text-muted-foreground">При отмене заказа:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5" />
                <span>Статус заказа изменится на "Отменён"</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5" />
                <span>Клиент получит уведомление об отмене</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mt-1.5" />
                <span>Статус больше не получится изменить</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Оставить как есть
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Отмена...
              </>
            ) : (
              'Да, отменить заказ'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
