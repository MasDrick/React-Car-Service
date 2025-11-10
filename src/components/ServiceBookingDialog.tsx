import { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createOrder } from '@/store/slices/ordersSlice';
import type { Service } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { formatDuration, formatPrice } from '@/lib/utils';

type ServiceBookingDialogProps = {
  service: Service;
  isAuthenticated?: boolean;
};

const toLocalInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const ServiceBookingDialog = ({ service, isAuthenticated }: ServiceBookingDialogProps) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.orders);

  const getDefaultDateTime = () => {
    const date = new Date();
    date.setHours(date.getHours() + 2, 0, 0, 0);
    return toLocalInputValue(date);
  };

  const [open, setOpen] = useState(false);
  const [dateTime, setDateTime] = useState(getDefaultDateTime);
  const [notes, setNotes] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const minDateTime = useMemo(() => toLocalInputValue(new Date()), [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!dateTime) {
      setLocalError('Выберите дату и время');
      return;
    }

    try {
      await dispatch(
        createOrder({
          service_id: service.id,
          date: new Date(dateTime).toISOString(),
          notes: notes.trim() ? notes.trim() : undefined,
        })
      ).unwrap();

      setLocalError(null);
      setOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError('Не удалось создать заказ');
      }
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setLocalError(null);
      setDateTime(getDefaultDateTime());
      setNotes('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex-1" variant="default" disabled={!isAuthenticated}>
          Записаться
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Запись на услугу</DialogTitle>
          <DialogDescription>
            Услуга: <span className="font-medium text-foreground">{service.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Стоимость</span>
              <span className="font-semibold text-foreground">{formatPrice(service.price)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span>Длительность</span>
              <span className="font-semibold text-foreground">
                {formatDuration(service.duration)}
              </span>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-foreground flex flex-col gap-1"
                htmlFor="booking-datetime"
              >
                Дата и время
              </label>
              <Input
                id="booking-datetime"
                type="datetime-local"
                className="text-foreground"
                value={dateTime}
                min={minDateTime}
                onChange={event => setDateTime(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2 flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground" htmlFor="booking-notes">
                Комментарий (необязательно)
              </label>
              <Textarea
                id="booking-notes"
                placeholder="Например, уточнить дополнительные пожелания"
                value={notes}
                onChange={event => setNotes(event.target.value)}
                maxLength={300}
              />
              <div className="text-xs text-muted-foreground text-right">{notes.length}/300</div>
            </div>

            {(localError || error) && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {localError || error}
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Сохраняем...' : 'Подтвердить запись'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
