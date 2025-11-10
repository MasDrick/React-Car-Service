import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Моковая авторизация - принимает любой логин/пароль
    const mockUser = {
      id: 1,
      username: username || 'testuser',
      email: `${username || 'testuser'}`,
      role: username === 'admin' ? ('admin' as const) : ('client' as const),
      avatar:
        'https://avatars.mds.yandex.net/i?id=41868f0fe041dbb1ffc546dc2c90f86c_l-10805295-images-thumbs&n=13',
    };

    const mockToken = 'mock_token_' + Date.now();

    dispatch(setCredentials({ user: mockUser, token: mockToken }));
    navigate('/services');
  };

  const handleQuickLogin = (role: 'client' | 'admin') => {
    const mockUser = {
      id: 1,
      username: role === 'admin' ? 'admin' : 'client',
      email: `${role}@example.com`,
      role,
      avatar:
        role === 'admin'
          ? 'https://i.pinimg.com/474x/18/ee/50/18ee5057f47adb0f9e03f4ee9773ae7a.jpg'
          : 'https://i.pinimg.com/736x/f0/cc/cb/f0cccbf21474307d4a3ff8fde01e3a66.jpg',
    };

    const mockToken = 'mock_token_' + Date.now();

    dispatch(setCredentials({ user: mockUser, token: mockToken }));
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card text-card-foreground rounded-lg shadow-md p-8 border border-border">
        <h1 className="text-3xl font-bold text-center text-foreground mb-8">Автосервис</h1>
        <h2 className="text-xl font-semibold text-center text-card-foreground mb-6">
          Вход в систему
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
              Логин
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Введите логин"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Введите пароль"
            />
          </div>

          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-4">
            Быстрый вход для тестирования:
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleQuickLogin('client')}
            >
              Войти как Клиент
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleQuickLogin('admin')}
            >
              Войти как Админ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
