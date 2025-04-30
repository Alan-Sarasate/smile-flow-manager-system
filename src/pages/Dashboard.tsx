
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, ShoppingCart, User, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo à gestão da sua clínica odontológica.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in anim-delay-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 comparado a ontem</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 18.560</div>
            <p className="text-xs text-muted-foreground">+15% comparado ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Novos Pacientes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 comparado ao mês anterior</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Itens em Baixa</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground text-red-500">Alerta de reabastecimento</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="animate-fade-in anim-delay-500">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">João Silva</p>
                  <p className="text-sm text-muted-foreground">Limpeza</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">10:30</p>
                <p className="text-xs text-muted-foreground">Hoje</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Maria Oliveira</p>
                  <p className="text-sm text-muted-foreground">Clareamento</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">13:45</p>
                <p className="text-xs text-muted-foreground">Hoje</p>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Carlos Santos</p>
                  <p className="text-sm text-muted-foreground">Avaliação</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">09:15</p>
                <p className="text-xs text-muted-foreground">Amanhã</p>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full">Ver Todos</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-500">
          <CardHeader>
            <CardTitle>Estoque Crítico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-destructive/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Resina Z350</p>
                  <p className="text-sm text-muted-foreground">Estoque: 2 unidades</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Repor</Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-destructive/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Anestésico</p>
                  <p className="text-sm text-muted-foreground">Estoque: 5 unidades</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Repor</Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-yellow-500/10 p-2 rounded-full">
                  <ShoppingCart className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">Alginato</p>
                  <p className="text-sm text-muted-foreground">Estoque: 8 unidades</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Repor</Button>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full">Ver Estoque Completo</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
