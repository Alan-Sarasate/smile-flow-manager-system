
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import AppointmentForm from './AppointmentForm';
import { getDailyAppointments, getAvailableTimeSlotsForDate, cancelAppointment } from '@/services/appointmentService';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';

interface AppointmentCalendarProps {
  selectedDate?: Date;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: {
    id: string;
    patient: string;
    procedure: string;
    status: string;
  } | null;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ selectedDate }) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      
      try {
        // 1. Buscar slots disponíveis para o dia
        const availableSlots = await getAvailableTimeSlotsForDate(selectedDate);
        
        // 2. Buscar agendamentos existentes
        const appointments = await getDailyAppointments(selectedDate);
        
        // 3. Mapear agendamentos para os slots
        const slots = availableSlots.map(slot => {
          const slotTime = parse(slot.time, 'HH:mm', selectedDate);
          const matchingAppointment = appointments.find(app => {
            const appTime = format(new Date(app.date), 'HH:mm');
            return appTime === slot.time;
          });
          
          return {
            time: slot.time,
            available: slot.available && !matchingAppointment,
            appointment: matchingAppointment ? {
              id: matchingAppointment.id,
              patient: matchingAppointment.client_name || '',
              procedure: matchingAppointment.procedure_name || '',
              status: matchingAppointment.status
            } : null
          };
        });
        
        setTimeSlots(slots);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        toast.error('Erro ao carregar horários');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate, refreshTrigger]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const result = await cancelAppointment(appointmentId);
      
      if (result.success) {
        toast.success('Agendamento cancelado com sucesso');
        handleRefresh();
      } else {
        toast.error('Erro ao cancelar agendamento');
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error('Erro ao cancelar agendamento');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
      case 'confirmed':
        return <Badge className="bg-green-500">Agendado</Badge>;
      case 'available':
        return <Badge className="bg-primary">Disponível</Badge>;
      case 'blocked':
        return <Badge variant="secondary">Bloqueado</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgência</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-muted-foreground">Cancelado</Badge>;
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

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Carregando horários...</p>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Não há horários disponíveis nesta data</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {timeSlots.map((slot, index) => (
        <div key={`${slot.time}-${index}`} className="p-4 hover:bg-muted/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-base font-medium w-16">{slot.time}</div>
              {slot.appointment ? 
                getStatusBadge(slot.appointment.status) : 
                (slot.available ? <Badge className="bg-primary">Disponível</Badge> : <Badge variant="secondary">Bloqueado</Badge>)
              }
            </div>
            
            <div className="flex gap-2">
              {slot.available ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">Agendar</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <AppointmentForm 
                      defaultValues={{
                        date: selectedDate,
                        time: slot.time
                      }}
                      onSuccess={handleRefresh}
                    />
                  </DialogContent>
                </Dialog>
              ) : slot.appointment && slot.appointment.status !== 'cancelled' ? (
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Editar</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <AppointmentForm 
                        appointmentId={slot.appointment.id}
                        defaultValues={{
                          date: selectedDate,
                          time: slot.time,
                          patientName: slot.appointment.patient,
                          procedure: slot.appointment.procedure
                        }}
                        onSuccess={handleRefresh}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => slot.appointment && handleCancelAppointment(slot.appointment.id)}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button size="sm" variant="outline" disabled={!slot.available}>
                  {slot.appointment?.status === 'cancelled' ? 'Cancelado' : 'Bloqueado'}
                </Button>
              )}
            </div>
          </div>
          
          {slot.appointment && slot.appointment.status !== 'cancelled' && (
            <div className="mt-2">
              <p className="font-medium">{slot.appointment.patient}</p>
              <p className="text-sm text-muted-foreground">{slot.appointment.procedure}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentCalendar;
