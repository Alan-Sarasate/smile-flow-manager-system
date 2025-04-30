
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  LayoutDashboard, 
  DollarSign, 
  ShoppingCart, 
  Clock, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Agendamentos', href: '/appointments', icon: Calendar },
  { label: 'Financeiro', href: '/finance', icon: DollarSign },
  { label: 'Estoque', href: '/inventory', icon: ShoppingCart },
  { label: 'Área do Cliente', href: '/booking', icon: Clock }
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div 
      className={cn(
        "bg-sidebar h-[calc(100vh-64px)] p-4 flex flex-col transition-all duration-200",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-end mb-6">
        <Button
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground"
        >
          {collapsed ? "›" : "‹"}
        </Button>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            to={item.href} 
            className={cn(
              "flex items-center py-2 px-3 rounded-md transition-colors",
              location.pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-sidebar-accent text-muted-foreground hover:text-sidebar-accent-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <item.icon className={cn("h-5 w-5", !collapsed && "mr-2")} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <Separator className="my-4" />
      
      <div className="space-y-2">
        <Button
          variant="ghost" 
          className={cn(
            "flex items-center py-2 px-3 w-full justify-start text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings className={cn("h-5 w-5", !collapsed && "mr-2")} />
          {!collapsed && <span>Configurações</span>}
        </Button>
        <Button 
          variant="ghost" 
          className={cn(
            "flex items-center py-2 px-3 w-full justify-start text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-2")} />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
