
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ClientSearch } from './ClientSearch';
import { 
  createAppointment, 
  updateAppointment,
  getAvailableTimeSlotsForDate 
} from '@/services/appointmentService';
import { Input } from "@/components/ui/input";
import { getClientById } from '@/services/clientService';

interface AppointmentFormProps {
  defaultValues?: {
    date?: Date;
    time?: string;
    patientName?: string;
    procedure?: string;
  };
  appointmentId?: string;
  onSuccess?: () => void;
}

const procedureOptions = [
  { value: "Avaliação", label: "Avaliação" },
  { value: "Limpeza", label: "Limpeza" },
  { value: "Restauração", label: "Restauração" },
  { value: "Extração", label: "Extração de Dente" },
  { value: "Canal", label: "Tratamento de Canal" },
  { value: "Clareamento", label: "Clareamento" },
  { value: "Prótese", label: "Prótese Dentária" },
  { value: "Implante", label: "Implante" },
];

const professionalOptions = [
  { value: "Dr. Silva", label: "Dr. Silva" },
  { value: "Dra. Santos", label: "Dra. Santos" },
  { value: "Dr. Oliveira", label: "Dr. Oliveira" },
  { value: "Dra. Lima", label: "Dra. Lima" },
];

const statusOptions = [
  { value: "scheduled", label: "Agendado" },
  { value: "confirmed", label: "Confirmado" },
  { value: "urgent", label: "Urgência" },
];

const formSchema = z.object({
  clientId: z.string({
    required_error: "Por favor selecione um paciente.",
  }),
  date: z.date({
    required_error: "Por favor selecione uma data.",
  }),
  time: z.string({
    required_error: "Por favor selecione um horário.",
  }),
  procedureName: z.string({
    required_error: "Por favor selecione um procedimento.",
  }),
  professional: z.string({
    required_error: "Por favor selecione um profissional.",
  }),
  status: z.string({
    required_error: "Por favor selecione um status.",
  }),
  price: z.coerce.number().min(0, "O valor não pode ser negativo"),
  duration: z.coerce.number().min(15, "A duração mínima é de 15 minutos"),
  notes: z.string().optional(),
});

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  defaultValues,
  appointmentId,
  onSuccess 
}) => {
  const [availableTimes, setAvailableTimes] = useState<{time: string, available: boolean}[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(defaultValues?.date || new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAppointment, setExistingAppointment] = useState<any>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: "",
      date: defaultValues?.date || new Date(),
      time: defaultValues?.time || "08:00",
      procedureName: defaultValues?.procedure || "",
      professional: "Dr. Silva",
      status: "scheduled",
      price: 150,
      duration: 30,
      notes: "",
    },
  });
  
  // Se tiver um ID de agendamento, buscar os dados do agendamento existente
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!appointmentId) return;
      
      setIsLoading(true);
      try {
        const { data: procedure, error } = await supabase
          .from('procedures')
          .select('*, clients(name)')
          .eq('id', appointmentId)
          .single();
          
        if (error) {
          toast.error('Erro ao carregar dados do agendamento');
          return;
        }
        
        if (procedure) {
          setExistingAppointment(procedure);
          
          const appointmentDate = new Date(procedure.date);
          setSelectedDate(appointmentDate);
          
          form.reset({
            clientId: procedure.client_id,
            date: appointmentDate,
            time: format(appointmentDate, 'HH:mm'),
            procedureName: procedure.name,
            professional: procedure.professional || 'Dr. Silva',
            status: procedure.status,
            price: procedure.price,
            duration: procedure.duration || 30,
            notes: procedure.notes || ''
          });
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
        toast.error('Erro ao carregar dados do agendamento');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAppointment();
  }, [appointmentId]);
  
  // Buscar horários disponíveis quando a data mudar
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      if (!selectedDate) return;
      
      try {
        const times = await getAvailableTimeSlotsForDate(selectedDate);
        setAvailableTimes(times);
      } catch (error) {
        console.error('Error fetching available times:', error);
      }
    };
    
    fetchAvailableTimes();
  }, [selectedDate]);
  
  const handleClientChange = (clientId: string, clientName?: string) => {
    form.setValue('clientId', clientId);
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      form.setValue('date', date);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // Combinar data e horário
      const dateTimeStr = `${format(values.date, 'yyyy-MM-dd')}T${values.time}:00`;
      const dateTime = new Date(dateTimeStr);
      
      if (appointmentId) {
        // Atualizar agendamento existente
        const result = await updateAppointment(appointmentId, {
          name: values.procedureName,
          date: dateTime,
          status: values.status,
          price: values.price,
          professional: values.professional,
          type: values.procedureName,
          duration: values.duration,
          notes: values.notes
        });
        
        if (result.success) {
          toast.success("Agendamento atualizado com sucesso");
          onSuccess?.();
        } else {
          toast.error("Erro ao atualizar agendamento");
        }
      } else {
        // Criar novo agendamento
        const result = await createAppointment({
          client_id: values.clientId,
          name: values.procedureName,
          date: dateTime,
          status: values.status,
          price: values.price,
          professional: values.professional,
          type: values.procedureName,
          duration: values.duration,
          notes: values.notes
        });
        
        if (result.success) {
          toast.success("Agendamento criado com sucesso");
          onSuccess?.();
        } else {
          toast.error("Erro ao criar agendamento");
        }
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error("Erro ao processar agendamento");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Carregando dados do agendamento...</p>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {appointmentId ? "Editar Agendamento" : "Novo Agendamento"}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para {appointmentId ? "editar o" : "agendar um"} horário.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Paciente</FormLabel>
                <FormControl>
                  <ClientSearch 
                    value={field.value} 
                    onChange={handleClientChange} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={handleDateChange}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableTimes.length > 0 ? (
                        availableTimes.map((slot) => (
                          <SelectItem 
                            key={slot.time} 
                            value={slot.time}
                            disabled={!slot.available && field.value !== slot.time}
                          >
                            {slot.time} {!slot.available && field.value !== slot.time && "- Indisponível"}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="08:00">08:00</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="procedureName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procedimento</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o procedimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {procedureOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="professional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profissional</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o profissional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professionalOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="150.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (min)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informações adicionais (opcional)" 
                    className="resize-none h-20" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AppointmentForm;

// Importação necessária para a função interna
import { supabase } from '@/integrations/supabase/client';
