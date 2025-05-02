
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import AvailabilityManager from '@/components/appointments/AvailabilityManager';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDailyAppointments } from '@/services/appointmentService';

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  // Carregar agendamentos para a data selecionada
  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments', date?.toISOString(), refreshTrigger],
    queryFn: () => date ? getDailyAppointments(date) : Promise.resolve([]),
    enabled: !!date
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agendamentos</h1>
          <p className="text-muted-foreground">Gerencie os horários disponíveis e agendamentos.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Novo Horário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <AppointmentForm onSuccess={handleRefresh} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="availability">Disponibilidade</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Selecione uma data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="p-3 pointer-events-auto border-t rounded-none"
                />
                <div className="px-4 py-3 border-t">
                  <h3 className="font-medium mb-1">Legenda</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                      <span>Disponível</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Agendado</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                      <span>Bloqueado</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
                      <span>Urgência</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle>
                    {date ? date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Selecione uma data'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <AppointmentCalendar selectedDate={date} />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-3 font-medium">
                  <div>Paciente</div>
                  <div>Procedimento</div>
                  <div>Data</div>
                  <div>Horário</div>
                  <div>Status</div>
                  <div className="text-right">Ações</div>
                </div>
                <div className="divide-y">
                  {isLoading ? (
                    <div className="p-3 text-center">Carregando...</div>
                  ) : appointments && appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <div key={appointment.id} className="grid grid-cols-6 p-3 items-center">
                        <div>{appointment.client_name}</div>
                        <div>{appointment.procedure_name}</div>
                        <div>{new Date(appointment.date).toLocaleDateString('pt-BR')}</div>
                        <div>{new Date(appointment.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</div>
                        <div>
                          {appointment.status === 'scheduled' && 'Agendado'}
                          {appointment.status === 'confirmed' && 'Confirmado'}
                          {appointment.status === 'urgent' && 'Urgência'}
                          {appointment.status === 'cancelled' && 'Cancelado'}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">Editar</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <AppointmentForm
                                appointmentId={appointment.id}
                                defaultValues={{
                                  date: new Date(appointment.date),
                                  time: new Date(appointment.date).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
                                  patientName: appointment.client_name,
                                  procedure: appointment.procedure_name
                                }}
                                onSuccess={handleRefresh}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button variant="destructive" size="sm">Cancelar</Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-muted-foreground">
                      Nenhum agendamento encontrado
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-4">
          <AvailabilityManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
