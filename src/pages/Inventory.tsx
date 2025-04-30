
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import InventoryList from '@/components/inventory/InventoryList';
import InventoryForm from '@/components/inventory/InventoryForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';

const Inventory = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">Gerencie o estoque de materiais odontológicos.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <InventoryForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in anim-delay-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">48 categorias</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 32.450</div>
            <p className="text-xs text-muted-foreground">Atualizado hoje</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500">Estoque Baixo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500">Vencimentos Próximos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Próximos 30 dias</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Todos os Itens</TabsTrigger>
          <TabsTrigger value="low">Estoque Baixo</TabsTrigger>
          <TabsTrigger value="expiring">Vencendo</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="low" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens com Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryList filterType="low" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expiring" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Itens Próximos ao Vencimento</CardTitle>
            </CardHeader>
            <CardContent>
              <InventoryList filterType="expiring" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Categorias de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {['Resinas', 'Anestésicos', 'Materiais de Impressão', 'Instrumentos', 'Equipamentos', 'Higiene', 'Ortodontia', 'Descartáveis'].map((category) => (
                  <Button key={category} variant="outline" className="justify-start h-auto py-4">
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
