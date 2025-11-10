import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { ModeToggle } from '@/components/mode-toggle';
import { NavUser } from '@/components/NavUser.tsx';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinks = [{ to: '/services', label: 'Услуги' }];

  // Для клиентов добавляем "Мои заказы", для админов - "Админ"
  if (user?.role === 'client') {
    navLinks.push({ to: '/orders', label: 'Мои заказы' });
  } else if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Админ' });
  }

  return (
    <header className="w-full border-b border-border bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* ЛОГОТИП */}
        <Link to="/services" className="text-2xl font-bold text-card-foreground">
          <div className="flex items-center gap-2 h">
            <img className="h-9" src="/car_logo.svg" alt="" />
            <h1>Автосервис</h1>
          </div>
        </Link>

        {/* ДЕСКТОП-НАВИГАЦИЯ */}
        {isAuthenticated && (
          <nav className="hidden md:flex gap-6 items-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.to ? 'text-primary' : 'text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* пользователь */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <NavUser user={user} onLogout={handleLogout} />
            </>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </div>

        {/* МОБИЛЬНОЕ МЕНЮ */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <nav className="flex flex-col gap-4 mt-8 p-4">
                <div className="mb-4">
                  <ModeToggle />
                </div>
                {isAuthenticated ? (
                  <>
                    {navLinks.map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          location.pathname === link.to ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                    <NavUser user={user} onLogout={handleLogout} />
                  </>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/login">Войти</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
