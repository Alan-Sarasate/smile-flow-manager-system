
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Package, 
  Settings,
  Users,
  FileText,
  BarChart
} from 'lucide-react';

const items = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Agendamentos',
    href: '/appointments',
    icon: Calendar,
  },
  {
    title: 'Financeiro',
    href: '/finance',
    icon: DollarSign,
  },
  {
    title: 'Clientes',
    href: '/clients',
    icon: Users,
  },
  {
    title: 'Estoque',
    href: '/inventory',
    icon: Package,
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: BarChart,
  }
];

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuthStore();
  
  return (
    <div className="pb-12 w-64 bg-background border-r min-h-screen">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Menu Principal
          </h2>
          <div className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  location.pathname === item.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        
        {isAdmin && (
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Administração
            </h2>
            <div className="space-y-1">
              <Link
                to="/settings"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  location.pathname === '/settings'
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                Configurações
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
