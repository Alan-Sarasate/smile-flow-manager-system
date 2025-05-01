
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, ShoppingCart, User, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getUpcomingAppointments } from '@/services/appointmentService';
import { getCriticalInventory } from '@/services/inventoryService';
import { Appointment, InventoryItem } from '@/types/supabase';
import { format, isToday, isTomorrow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const { toast } = useToast();
  
  // Fetch upcoming appointments with React Query
  const { 
    data: appointments = [], 
    isLoading: appointmentsLoading,
    error: appointmentsError
  } = useQuery({
    queryKey: ['upcomingAppointments'],
    queryFn: getUpcomingAppointments,
    staleTime: 1000 * 60 * 5, // 5 minutes
    meta: {
      onError: () => {
        toast({
          title: "Erro ao carregar agendamentos",
          description: "Não foi possível carregar os próximos agendamentos",
          variant: "destructive"
        });
      }
    }
  });
  
  // Fetch critical inventory with React Query
  const { 
    data: inventoryItems = [], 
    isLoading: inventoryLoading,
    error: inventoryError
  } = useQuery({
    queryKey: ['criticalInventory'],
    queryFn: getCriticalInventory,
    staleTime: 1000 * 60 * 5, // 5 minutes
    meta: {
      onError: () => {
        toast({
          title: "Erro ao carregar inventário",
          description: "Não foi possível carregar os itens críticos de estoque",
          variant: "destructive"
        });
      }
    }
  });
  
  // Format the date display for appointments
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return 'Hoje';
    } else if (isTomorrow(date)) {
      return 'Amanhã';
    } else {
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    }
  };
  
  // Format the time display for appointments
  const formatAppointmentTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  // Count today's appointments
  const todayAppointments = appointments.filter(apt => isToday(new Date(apt.date))).length;

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
            <div className="text-2xl font-bold">
              {appointmentsLoading ? "..." : todayAppointments}
            </div>
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
            <div className="text-2xl font-bold">{inventoryLoading ? "..." : inventoryItems.length}</div>
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
            {appointmentsLoading ? (
              <p className="text-center text-muted-foreground py-4">Carregando agendamentos...</p>
            ) : appointmentsError ? (
              <p className="text-center text-red-500 py-4">Erro ao carregar agendamentos</p>
            ) : appointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum agendamento próximo</p>
            ) : (
              appointments.slice(0, 3).map((appointment) => (
                <React.Fragment key={appointment.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.client_name}</p>
                        <p className="text-sm text-muted-foreground">{appointment.procedure_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatAppointmentTime(appointment.date)}</p>
                      <p className="text-xs text-muted-foreground">{formatAppointmentDate(appointment.date)}</p>
                    </div>
                  </div>
                  {appointments.indexOf(appointment) < Math.min(2, appointments.length - 1) && <Separator />}
                </React.Fragment>
              ))
            )}
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/appointments">Ver Todos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in anim-delay-500">
          <CardHeader>
            <CardTitle>Estoque Crítico</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {inventoryLoading ? (
              <p className="text-center text-muted-foreground py-4">Carregando estoque...</p>
            ) : inventoryError ? (
              <p className="text-center text-red-500 py-4">Erro ao carregar estoque</p>
            ) : inventoryItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Nenhum item em estoque crítico</p>
            ) : (
              inventoryItems.map((item) => (
                <React.Fragment key={item.id}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className={`${
                        item.status === 'critical' ? 'bg-destructive/10' : 'bg-yellow-500/10'
                      } p-2 rounded-full`}>
                        <ShoppingCart className={`h-5 w-5 ${
                          item.status === 'critical' ? 'text-destructive' : 'text-yellow-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Estoque: {item.quantity} unidades</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Repor</Button>
                  </div>
                  {inventoryItems.indexOf(item) < inventoryItems.length - 1 && <Separator />}
                </React.Fragment>
              ))
            )}
            <div className="pt-2">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/inventory">Ver Estoque Completo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
