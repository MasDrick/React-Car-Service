import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/PageLayout';
import { OrdersTab } from '@/components/admin/OrdersTab';
import { ServicesTab } from '@/components/admin/ServicesTab';

const Admin = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Панель администратора</h1>
          <p className="text-muted-foreground mt-2">Управление заказами и услугами</p>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="mt-6">
            <OrdersTab />
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            <ServicesTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Admin;
