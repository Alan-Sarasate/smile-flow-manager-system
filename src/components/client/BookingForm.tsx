
import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const procedureOptions = [
  { value: "limpeza", label: "Limpeza" },
  { value: "restauracao", label: "Restauração" },
  { value: "extracao", label: "Extração de Dente" },
  { value: "canal", label: "Tratamento de Canal" },
  { value: "clareamento", label: "Clareamento" },
  { value: "avaliacao", label: "Avaliação" },
  { value: "protese", label: "Prótese Dentária" },
  { value: "implante", label: "Implante" },
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00"
];

const formSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  phone: z.string().min(8, { message: "Telefone inválido." }),
  procedure: z.string({ required_error: "Selecione um procedimento." }),
  date: z.date({ required_error: "Selecione uma data." }),
  time: z.string({ required_error: "Selecione um horário." }),
  isNewPatient: z.enum(["yes", "no"], {
    required_error: "Por favor, informe se é a primeira consulta.",
  }),
  notes: z.string().optional(),
});

const BookingForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      procedure: "",
      date: new Date(),
      time: "",
      isNewPatient: "no",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsSubmitted(true);
    toast.success("Agendamento realizado com sucesso!", {
      description: `${format(values.date, "dd/MM/yyyy")} às ${values.time}`,
    });
  }

  // Mock function to check if time slot is available (in a real app, this would query a backend)
  const isTimeSlotAvailable = (time: string) => {
    const unavailableTimes = ["09:00", "10:30", "14:00", "16:30"];
    return !unavailableTimes.includes(time);
  };
  
  if (isSubmitted) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold">Agendamento Confirmado!</h3>
        <p className="text-muted-foreground">
          Sua consulta foi agendada com sucesso para {format(form.getValues().date, "dd/MM/yyyy")} às {form.getValues().time}.
        </p>
        <p className="text-muted-foreground">
          Enviamos um email de confirmação para {form.getValues().email}.
        </p>
        <div className="pt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              form.reset();
              setIsSubmitted(false);
            }}
          >
            Fazer Novo Agendamento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Pessoais</h3>
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="isNewPatient"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>É sua primeira consulta em nossa clínica?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">Não</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detalhes da Consulta</h3>
          
          <FormField
            control={form.control}
            name="procedure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Procedimento Desejado</FormLabel>
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
                        onSelect={field.onChange}
                        disabled={(date) => {
                          // Disable weekends and past dates
                          const day = date.getDay();
                          const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                          return day === 0 || day === 6 || isPastDate;
                        }}
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
                      {timeSlots.map((time) => (
                        <SelectItem 
                          key={time} 
                          value={time}
                          disabled={!isTimeSlotAvailable(time)}
                        >
                          {time}{!isTimeSlotAvailable(time) ? ' (Indisponível)' : ''}
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
                <FormLabel>Observações Adicionais (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Informe detalhes adicionais que possam ser importantes..." 
                    className="resize-none h-20" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full">
            Confirmar Agendamento
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
