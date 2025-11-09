import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServices } from '@/store/slices/servicesSlice';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';

const Services = () => {
  const dispatch = useAppDispatch();
  const { services, isLoading, error } = useAppSelector(state => state.services);
  const { user } = useAppSelector(state => state.auth);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Услуги</h1>
          {isAdmin && (
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Добавить услугу
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">Загрузка услуг...</div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Услуги пока не добавлены</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <Card key={service.id} service={service} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Services;
