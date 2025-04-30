
import React from 'react';
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AppointmentFormProps {
  defaultValues?: {
    date?: Date;
    time?: string;
    patient?: string;
    procedure?: string;
  };
}

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

const timeOptions = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

const formSchema = z.object({
  date: z.date({
    required_error: "Por favor selecione uma data.",
  }),
  time: z.string({
    required_error: "Por favor selecione um horário.",
  }),
  patientName: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  patientPhone: z.string().min(8, {
    message: "Por favor insira um telefone válido.",
  }),
  procedure: z.string({
    required_error: "Por favor selecione um procedimento.",
  }),
  notes: z.string().optional(),
});

const AppointmentForm: React.FC<AppointmentFormProps> = ({ defaultValues }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultValues?.date || new Date(),
      time: defaultValues?.time || "08:00",
      patientName: defaultValues?.patient || "",
      patientPhone: "",
      procedure: defaultValues?.procedure?.toLowerCase() || "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Agendamento salvo com sucesso", {
      description: `${values.patientName}, ${format(values.date, "dd/MM/yyyy")} às ${values.time}`,
    });
    console.log(values);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {form.getValues().patientName ? "Editar Agendamento" : "Novo Agendamento"}
        </DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo para agendar um horário.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Paciente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="patientPhone"
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
                      {timeOptions.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
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
            name="procedure"
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
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default AppointmentForm;
