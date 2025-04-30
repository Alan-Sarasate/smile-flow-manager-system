
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  return (
    <nav className="h-16 border-b flex items-center justify-between px-4 bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-dental-blue">DentalClinic</h1>
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-9 w-[200px] lg:w-[300px] bg-muted/30" 
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
