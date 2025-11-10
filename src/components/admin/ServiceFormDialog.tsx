import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { createService, updateService } from '@/store/slices/servicesSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Service } from '@/types';

type ServiceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service;
  onSuccess?: () => void;
};

export const ServiceFormDialog = ({
  open,
  onOpenChange,
  service,
  onSuccess,
}: ServiceFormDialogProps) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    img: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!service;

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        price: service.price.toString(),
        duration: service.duration.toString(),
        img: service.img,
        description: service.description || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        duration: '',
        img: '',
        description: '',
      });
    }
    setError(null);
  }, [service, open]);

  const validate = () => {
    if (!formData.name.trim()) {
      setError('Название услуги обязательно');
      return false;
    }
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Цена должна быть положительным числом');
      return false;
    }
    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration <= 0) {
      setError('Длительность должна быть положительным числом');
      return false;
    }
    if (!formData.img.trim()) {
      setError('URL изображения обязателен');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const serviceData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        img: formData.img.trim(),
        description: formData.description.trim() || undefined,
      };

      if (isEditing && service) {
        await dispatch(updateService({ id: service.id, data: serviceData })).unwrap();
      } else {
        await dispatch(createService(serviceData)).unwrap();
      }

      onSuccess?.();
      onOpenChange(false);
    } catch {
      setError('Ошибка сохранения услуги');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать услугу' : 'Добавить услугу'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Внесите изменения в данные услуги'
              : 'Заполните форму для добавления новой услуги'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 flex flex-col gap-1">
            <Label htmlFor="name">Название *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например: Замена масла"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col gap-1">
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="1500"
                required
              />
            </div>
            <div className="space-y-2 flex flex-col gap-1">
              <Label htmlFor="duration">Длительность (мин) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                placeholder="30"
                required
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col gap-1">
            <Label htmlFor="img">URL изображения *</Label>
            <Input
              id="img"
              value={formData.img}
              onChange={e => setFormData({ ...formData, img: e.target.value })}
              placeholder="/oil.png"
              required
            />
            {formData.img && (
              <div className="mt-1">
                <img
                  src={formData.img}
                  alt="Превью"
                  className="h-32 w-32 object-cover rounded border border-border"
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2 flex flex-col gap-1">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Подробное описание услуги..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
