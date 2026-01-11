import { Home, Users, ClipboardList, Gift, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/friends', icon: Users, label: '친구' },
    { path: '/missions', icon: ClipboardList, label: '미션' },
    { path: '/rewards', icon: Gift, label: '보상' },
    { path: '/ranking', icon: Trophy, label: '랭킹' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
