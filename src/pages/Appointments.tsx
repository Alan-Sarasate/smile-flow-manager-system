
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import AppointmentCalendar from '@/components/appointments/AppointmentCalendar';
import AppointmentForm from '@/components/appointments/AppointmentForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
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
            <AppointmentForm />
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
                <div className="grid grid-cols-5 bg-muted/50 p-3 font-medium">
                  <div>Paciente</div>
                  <div>Procedimento</div>
                  <div>Data</div>
                  <div>Horário</div>
                  <div className="text-right">Ações</div>
                </div>
                <div className="divide-y">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 items-center">
                      <div>João Silva</div>
                      <div>Clareamento</div>
                      <div>{new Date().toLocaleDateString('pt-BR')}</div>
                      <div>14:30</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="destructive" size="sm">Cancelar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-3">Horários Padrão</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Segunda-feira</h4>
                        <div className="text-sm">08:00 - 12:00</div>
                        <div className="text-sm">14:00 - 18:00</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Terça-feira</h4>
                        <div className="text-sm">08:00 - 12:00</div>
                        <div className="text-sm">14:00 - 18:00</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Quarta-feira</h4>
                        <div className="text-sm">08:00 - 12:00</div>
                        <div className="text-sm">14:00 - 18:00</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Quinta-feira</h4>
                        <div className="text-sm">08:00 - 12:00</div>
                        <div className="text-sm">14:00 - 18:00</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Sexta-feira</h4>
                        <div className="text-sm">08:00 - 12:00</div>
                        <div className="text-sm">14:00 - 18:00</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Sábado</h4>
                        <div className="text-sm">08:00 - 12:00</div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Domingo</h4>
                        <div className="text-sm text-muted-foreground">Fechado</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline">Editar Horários Padrão</Button>
                  </div>
                </div>
                
                <div className="rounded-md border p-4">
                  <h3 className="font-medium mb-3">Bloqueios e Exceções</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Feriado - Corpus Christi</p>
                        <p className="text-sm text-muted-foreground">30/05/2025 - Dia todo</p>
                      </div>
                      <Button variant="ghost" size="sm">Remover</Button>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">Consulta Dr. Carlos</p>
                        <p className="text-sm text-muted-foreground">05/05/2025 - 14:00 às 15:30</p>
                      </div>
                      <Button variant="ghost" size="sm">Remover</Button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button>Adicionar Exceção</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appointments;
