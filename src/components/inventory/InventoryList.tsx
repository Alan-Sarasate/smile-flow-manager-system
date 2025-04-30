
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import InventoryForm from './InventoryForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  expiryDate?: string;
}

interface InventoryListProps {
  filterType?: 'all' | 'low' | 'expiring';
}

// Mock inventory data
const inventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: 'Resina Z350',
    category: 'Resinas',
    quantity: 2,
    minQuantity: 5,
    price: 150,
  },
  {
    id: 2,
    name: 'Anestésico Lidocaína',
    category: 'Anestésicos',
    quantity: 5,
    minQuantity: 10,
    price: 45,
    expiryDate: '30/06/2025',
  },
  {
    id: 3,
    name: 'Alginato',
    category: 'Materiais de Impressão',
    quantity: 8,
    minQuantity: 5,
    price: 75,
  },
  {
    id: 4,
    name: 'Ionômero de Vidro',
    category: 'Restauradores',
    quantity: 12,
    minQuantity: 3,
    price: 120,
  },
  {
    id: 5,
    name: 'Luvas Descartáveis (cx)',
    category: 'Descartáveis',
    quantity: 4,
    minQuantity: 5,
    price: 28,
  },
  {
    id: 6,
    name: 'Fio de Sutura',
    category: 'Cirúrgicos',
    quantity: 15,
    minQuantity: 5,
    price: 35,
    expiryDate: '15/05/2025',
  },
  {
    id: 7,
    name: 'Papel Carbono',
    category: 'Diversos',
    quantity: 30,
    minQuantity: 10,
    price: 12,
  },
];

const InventoryList: React.FC<InventoryListProps> = ({ filterType = 'all' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  let filteredItems = [...inventoryItems];

  // Filter by type first
  if (filterType === 'low') {
    filteredItems = filteredItems.filter(item => item.quantity <= item.minQuantity);
  } else if (filterType === 'expiring') {
    // For demo purposes, just show items with expiry dates
    filteredItems = filteredItems.filter(item => item.expiryDate);
  }

  // Then apply search filter
  if (searchQuery) {
    filteredItems = filteredItems.filter(
      item => item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Then apply category filter
  if (categoryFilter !== 'all') {
    filteredItems = filteredItems.filter(item => item.category === categoryFilter);
  }

  // Get unique categories
  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="all" onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar item..." 
            className="pl-9 w-full md:w-[300px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-7 bg-muted/50 p-3 font-medium">
          <div className="col-span-2">Nome</div>
          <div>Categoria</div>
          <div>Qtd</div>
          <div>Mínimo</div>
          <div>Valor Unit.</div>
          <div className="text-right">Ações</div>
        </div>
        <div className="divide-y">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="grid grid-cols-7 p-3 items-center">
                <div className="col-span-2">
                  <div className="font-medium">{item.name}</div>
                  {item.expiryDate && (
                    <div className="text-xs text-muted-foreground">
                      Vence em: {item.expiryDate}
                    </div>
                  )}
                </div>
                <div>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <div className={`font-medium ${item.quantity <= item.minQuantity ? 'text-red-500' : ''}`}>
                  {item.quantity}
                </div>
                <div className="text-muted-foreground">{item.minQuantity}</div>
                <div>R$ {item.price.toFixed(2).replace('.', ',')}</div>
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <InventoryForm defaultValues={item} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" className="text-dental-blue">
                    +
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="text-muted-foreground">Nenhum item encontrado</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredItems.length} de {inventoryItems.length} itens
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm">Próxima</Button>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
