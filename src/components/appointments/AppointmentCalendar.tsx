
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AppointmentForm from './AppointmentForm';

interface AppointmentCalendarProps {
  selectedDate?: Date;
}

interface Appointment {
  id: number;
  time: string;
  patient: string;
  procedure: string;
  status: 'scheduled' | 'available' | 'blocked' | 'urgent';
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ selectedDate }) => {
  // Mock data for appointments
  const appointments: Appointment[] = [
    { id: 1, time: '08:00', patient: 'Maria Santos', procedure: 'Limpeza', status: 'scheduled' },
    { id: 2, time: '09:00', patient: '', procedure: '', status: 'available' },
    { id: 3, time: '10:00', patient: 'João Silva', procedure: 'Extração', status: 'scheduled' },
    { id: 4, time: '11:00', patient: 'Pedro Alves', procedure: 'Avaliação', status: 'urgent' },
    { id: 5, time: '13:00', patient: '', procedure: '', status: 'available' },
    { id: 6, time: '14:00', patient: 'Ana Costa', procedure: 'Restauração', status: 'scheduled' },
    { id: 7, time: '15:00', patient: '', procedure: '', status: 'blocked' },
    { id: 8, time: '16:00', patient: '', procedure: '', status: 'available' },
    { id: 9, time: '17:00', patient: 'Carlos Mendes', procedure: 'Clareamento', status: 'scheduled' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-green-500">Agendado</Badge>;
      case 'available':
        return <Badge className="bg-primary">Disponível</Badge>;
      case 'blocked':
        return <Badge variant="secondary">Bloqueado</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgência</Badge>;
      default:
        return null;
    }
  };

  if (!selectedDate) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Selecione uma data para ver os agendamentos</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {appointments.map((appointment) => (
        <div key={appointment.id} className="p-4 hover:bg-muted/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-base font-medium w-16">{appointment.time}</div>
              {getStatusBadge(appointment.status)}
            </div>
            
            <div className="flex gap-2">
              {appointment.status === 'available' ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">Agendar</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <AppointmentForm 
                      defaultValues={{
                        date: selectedDate,
                        time: appointment.time
                      }}
                    />
                  </DialogContent>
                </Dialog>
              ) : appointment.status === 'scheduled' ? (
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <AppointmentForm 
                        defaultValues={{
                          date: selectedDate,
                          time: appointment.time,
                          patient: appointment.patient,
                          procedure: appointment.procedure
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="destructive">Cancelar</Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" disabled={appointment.status === 'blocked'}>
                  {appointment.status === 'blocked' ? 'Bloqueado' : 'Opções'}
                </Button>
              )}
            </div>
          </div>
          
          {appointment.status === 'scheduled' && (
            <div className="mt-2">
              <p className="font-medium">{appointment.patient}</p>
              <p className="text-sm text-muted-foreground">{appointment.procedure}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentCalendar;
