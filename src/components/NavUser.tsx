import type { User } from '@/types';
import { CircleUserRound, DoorOpen, Moon, Sun, Monitor, EllipsisVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

interface NavUserProps {
  user: User | null;
  onLogout?: () => void;
}

export function NavUser({ user, onLogout }: NavUserProps) {
  const { theme, setTheme } = useTheme();
  if (!user) return null;

  const { username, email, avatar } = user;

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'light':
        return <Sun className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-accent">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{username}</span>
            <span className="text-muted-foreground truncate text-xs">{email}</span>
          </div>
          <EllipsisVertical className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuGroup>
          {/* Личный кабинет */}
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center cursor-pointer">
              <CircleUserRound className="mr-2 h-4 w-4" />
              <span>Личный кабинет</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
              <div className="mr-2 h-4 w-4">{getThemeIcon()}</div>
              <span>Тема оформления</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => setTheme('light')}
                className="flex items-center cursor-pointer"
              >
                <Sun className="mr-2 h-4 w-4" />
                <span>Светлая</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('dark')}
                className="flex items-center cursor-pointer"
              >
                <Moon className="mr-2 h-4 w-4" />
                <span>Темная</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme('system')}
                className="flex items-center cursor-pointer"
              >
                <Monitor className="mr-2 h-4 w-4" />
                <span>Системная</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        {/* Смена темы с подменю */}

        <DropdownMenuSeparator />

        {/* Выход */}
        <DropdownMenuItem
          onClick={onLogout}
          variant={'destructive'}
          className="flex items-center cursor-pointer "
        >
          <DoorOpen className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
