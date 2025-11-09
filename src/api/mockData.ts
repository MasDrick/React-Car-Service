import type { Service } from '@/store/slices/servicesSlice';
import type { Order } from '@/store/slices/ordersSlice';

// Моковые данные для услуг
export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Замена масла',
    price: 1500,
    img: '/oil.png',
    duration: 30,
    description: 'Замена моторного масла и масляного фильтра',
  },
  {
    id: 2,
    name: 'Диагностика двигателя',
    price: 2500,
    img: '/engine_diagnostics.png',
    duration: 60,
    description: 'Полная компьютерная диагностика двигателя',
  },
  {
    id: 3,
    name: 'Замена тормозных колодок',
    price: 3500,
    img: '/brakes.png',
    duration: 90,
    description: 'Замена передних и задних тормозных колодок',
  },
  {
    id: 4,
    name: 'Шиномонтаж',
    price: 2000,
    img: '/tire_service.png',
    duration: 45,
    description: 'Снятие и установка колес, балансировка',
  },
  {
    id: 5,
    name: 'Замена аккумулятора',
    price: 4000,
    img: '/battery_replacement.png',
    duration: 30,
    description: 'Замена аккумуляторной батареи',
  },
  {
    id: 6,
    name: 'Промывка системы охлаждения',
    price: 1800,
    img: '/cooling_system.png',
    duration: 60,
    description: 'Промывка и замена охлаждающей жидкости',
  },
];

// Моковые данные для заказов
export const mockOrders: Order[] = [
  {
    id: 1,
    service_id: 1,
    service_name: 'Замена масла',
    user_id: 1,
    date: '2024-01-15T10:00:00',
    status: 'new',
    created_at: '2024-01-10T12:00:00',
  },
  {
    id: 2,
    service_id: 2,
    service_name: 'Диагностика двигателя',
    user_id: 1,
    date: '2024-01-20T14:00:00',
    status: 'in_progress',
    created_at: '2024-01-12T10:00:00',
  },
];

// Функция для имитации задержки API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
