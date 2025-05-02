
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Edit, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { 
  AvailabilitySetting, 
  AvailabilityException 
} from '@/types/supabase';
import {
  getAvailabilitySettings,
  updateAvailabilitySetting,
  createAvailabilitySetting,
  getAvailabilityExceptions,
  createAvailabilityException,
  deleteAvailabilityException
} from '@/services/appointmentService';

// Esquema para o formulário de configuração padrão
const settingSchema = z.object({
  day_of_week: z.coerce.number().min(0).max(6),
  start_time: z.string().refine(time => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Formato de hora inválido. Use o formato HH:MM."
  }),
  end_time: z.string().refine(time => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time), {
    message: "Formato de hora inválido. Use o formato HH:MM."
  }),
  interval_minutes: z.coerce.number().min(5).max(120),
  is_available: z.boolean()
}).refine(data => {
  // Validar que end_time é depois de start_time
  const startTime = parse(data.start_time, 'HH:mm', new Date());
  const endTime = parse(data.end_time, 'HH:mm', new Date());
  return endTime > startTime;
}, {
  message: "O horário final deve ser depois do horário inicial",
  path: ["end_time"]
});

// Esquema para o formulário de exceção
const exceptionSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  date: z.date({
    required_error: "Por favor selecione uma data."
  }),
  is_all_day: z.boolean().default(false),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  exception_type: z.enum(['block', 'holiday', 'personal', 'other']),
  description: z.string().optional()
}).refine(data => {
  // Se não for o dia todo, hora inicial e final são obrigatórias
  if (!data.is_all_day) {
    return data.start_time && data.end_time;
  }
  return true;
}, {
  message: "Horário inicial e final são obrigatórios para exceções parciais",
  path: ["start_time"]
}).refine(data => {
  // Se não for o dia todo, end_time deve ser depois de start_time
  if (!data.is_all_day && data.start_time && data.end_time) {
    const startTime = parse(data.start_time, 'HH:mm', new Date());
    const endTime = parse(data.end_time, 'HH:mm', new Date());
    return endTime > startTime;
  }
  return true;
}, {
  message: "O horário final deve ser depois do horário inicial",
  path: ["end_time"]
});

const dayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

// Nome dos tipos de exceção em português
const exceptionTypeNames: Record<string, string> = {
  block: 'Bloqueio',
  holiday: 'Feriado',
  personal: 'Compromisso pessoal',
  other: 'Outro'
};

export default function AvailabilityManager() {
  const [settings, setSettings] = useState<AvailabilitySetting[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [settingDialogOpen, setSettingDialogOpen] = useState(false);
  const [exceptionDialogOpen, setExceptionDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSetting, setEditingSetting] = useState<AvailabilitySetting | null>(null);
  
  const settingForm = useForm<z.infer<typeof settingSchema>>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      day_of_week: 1,
      start_time: '08:00',
      end_time: '12:00',
      interval_minutes: 30,
      is_available: true
    }
  });
  
  const exceptionForm = useForm<z.infer<typeof exceptionSchema>>({
    resolver: zodResolver(exceptionSchema),
    defaultValues: {
      title: '',
      date: new Date(),
      is_all_day: true,
      exception_type: 'block',
      description: ''
    }
  });
  
  // Carregar configurações e exceções
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [settingsData, exceptionsData] = await Promise.all([
          getAvailabilitySettings(),
          getAvailabilityExceptions()
        ]);
        
        setSettings(settingsData);
        setExceptions(exceptionsData);
      } catch (error) {
        console.error('Error loading availability data:', error);
        toast.error('Erro ao carregar configurações de disponibilidade');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Reset form quando abrir diálogo de configuração
  useEffect(() => {
    if (settingDialogOpen) {
      if (editingSetting) {
        settingForm.reset({
          day_of_week: editingSetting.day_of_week,
          start_time: editingSetting.start_time.substring(0, 5), // Remover segundos
          end_time: editingSetting.end_time.substring(0, 5), // Remover segundos
          interval_minutes: editingSetting.interval_minutes,
          is_available: editingSetting.is_available
        });
      } else {
        settingForm.reset({
          day_of_week: 1,
          start_time: '08:00',
          end_time: '12:00',
          interval_minutes: 30,
          is_available: true
        });
      }
    }
  }, [settingDialogOpen, editingSetting]);
  
  // Reset form quando abrir diálogo de exceção
  useEffect(() => {
    if (exceptionDialogOpen) {
      exceptionForm.reset({
        title: '',
        date: new Date(),
        is_all_day: true,
        start_time: '09:00',
        end_time: '10:00',
        exception_type: 'block',
        description: ''
      });
    }
  }, [exceptionDialogOpen]);
  
  // Agrupar configurações por dia da semana
  const settingsByDay = settings.reduce((acc, setting) => {
    const day = setting.day_of_week;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(setting);
    return acc;
  }, {} as Record<number, AvailabilitySetting[]>);
  
  // Manipular envio do formulário de configuração
  const onSubmitSetting = async (data: z.infer<typeof settingSchema>) => {
    try {
      if (editingSetting) {
        // Atualizar configuração existente
        const result = await updateAvailabilitySetting(editingSetting.id, data);
        if (result.success) {
          toast.success('Configuração atualizada com sucesso');
          // Atualizar estado
          setSettings(settings.map(s => 
            s.id === editingSetting.id ? { ...s, ...data } : s
          ));
        } else {
          toast.error('Erro ao atualizar configuração');
        }
      } else {
        // Criar nova configuração
        const result = await createAvailabilitySetting(data);
        if (result.success) {
          toast.success('Configuração criada com sucesso');
          // Recarregar configurações
          const updatedSettings = await getAvailabilitySettings();
          setSettings(updatedSettings);
        } else {
          toast.error('Erro ao criar configuração');
        }
      }
      setSettingDialogOpen(false);
    } catch (error) {
      console.error('Error submitting setting:', error);
      toast.error('Erro ao salvar configuração');
    }
  };
  
  // Manipular envio do formulário de exceção
  const onSubmitException = async (data: z.infer<typeof exceptionSchema>) => {
    try {
      // Converter data para formato ISO
      const dateStr = format(data.date, 'yyyy-MM-dd');
      
      // Criar objeto de exceção
      const exception: Omit<AvailabilityException, 'id' | 'created_at' | 'updated_at'> = {
        title: data.title,
        date: dateStr,
        is_all_day: data.is_all_day,
        exception_type: data.exception_type,
        description: data.description || null
      };
      
      // Adicionar horários apenas se não for o dia todo
      if (!data.is_all_day) {
        exception.start_time = data.start_time;
        exception.end_time = data.end_time;
      }
      
      const result = await createAvailabilityException(exception);
      
      if (result.success) {
        toast.success('Exceção criada com sucesso');
        // Recarregar exceções
        const updatedExceptions = await getAvailabilityExceptions();
        setExceptions(updatedExceptions);
        setExceptionDialogOpen(false);
      } else {
        toast.error('Erro ao criar exceção');
      }
    } catch (error) {
      console.error('Error submitting exception:', error);
      toast.error('Erro ao salvar exceção');
    }
  };
  
  // Manipular exclusão de exceção
  const handleDeleteException = async (id: string) => {
    try {
      const result = await deleteAvailabilityException(id);
      
      if (result.success) {
        toast.success('Exceção removida com sucesso');
        // Atualizar estado
        setExceptions(exceptions.filter(e => e.id !== id));
      } else {
        toast.error('Erro ao remover exceção');
      }
    } catch (error) {
      console.error('Error deleting exception:', error);
      toast.error('Erro ao remover exceção');
    }
  };
  
  if (isLoading) {
    return (
      <Card className="w-full animate-pulse">
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Horários Padrão</CardTitle>
          <Dialog open={settingDialogOpen} onOpenChange={setSettingDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingSetting(null);
                  setSettingDialogOpen(true);
                }}
              >
                Adicionar Horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingSetting ? 'Editar Horário' : 'Novo Horário'}</DialogTitle>
                <DialogDescription>
                  Configure os horários padrão de atendimento.
                </DialogDescription>
              </DialogHeader>
              <Form {...settingForm}>
                <form onSubmit={settingForm.handleSubmit(onSubmitSetting)} className="space-y-4">
                  <FormField
                    control={settingForm.control}
                    name="day_of_week"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dia da Semana</FormLabel>
                        <Select onValueChange={val => field.onChange(Number(val))} defaultValue={String(field.value)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o dia da semana" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dayNames.map((day, index) => (
                              <SelectItem key={index} value={String(index)}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={settingForm.control}
                      name="start_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário Inicial</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={settingForm.control}
                      name="end_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horário Final</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={settingForm.control}
                    name="interval_minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intervalo (minutos)</FormLabel>
                        <FormControl>
                          <Input type="number" min={5} max={120} step={5} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={settingForm.control}
                    name="is_available"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Disponível para Agendamento</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setSettingDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(settingsByDay).map(([day, daySettings]) => (
              <div key={day} className="space-y-2">
                <h3 className="text-sm font-medium">{dayNames[Number(day)]}</h3>
                {daySettings.length === 0 || (daySettings.length === 1 && !daySettings[0].is_available) ? (
                  <p className="text-sm text-muted-foreground">Fechado</p>
                ) : (
                  <div className="space-y-1">
                    {daySettings
                      .filter(setting => setting.is_available)
                      .map(setting => (
                        <div 
                          key={setting.id} 
                          className="flex justify-between items-center border-b pb-1"
                        >
                          <div className="text-sm">
                            {setting.start_time.substring(0, 5)} - {setting.end_time.substring(0, 5)}
                            <span className="text-xs text-muted-foreground ml-2">
                              ({setting.interval_minutes} min)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSetting(setting);
                              setSettingDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bloqueios e Exceções</CardTitle>
          <Dialog open={exceptionDialogOpen} onOpenChange={setExceptionDialogOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar Exceção</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Exceção</DialogTitle>
                <DialogDescription>
                  Adicione um bloqueio ou exceção na agenda.
                </DialogDescription>
              </DialogHeader>
              <Form {...exceptionForm}>
                <form onSubmit={exceptionForm.handleSubmit(onSubmitException)} className="space-y-4">
                  <FormField
                    control={exceptionForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Feriado, Reunião, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={exceptionForm.control}
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
                                  format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                    control={exceptionForm.control}
                    name="exception_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="block">Bloqueio</SelectItem>
                            <SelectItem value="holiday">Feriado</SelectItem>
                            <SelectItem value="personal">Compromisso pessoal</SelectItem>
                            <SelectItem value="other">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={exceptionForm.control}
                    name="is_all_day"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Dia Inteiro</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {!exceptionForm.watch('is_all_day') && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={exceptionForm.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário Inicial</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={exceptionForm.control}
                        name="end_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário Final</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={exceptionForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição (opcional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setExceptionDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exceptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma exceção cadastrada.</p>
            ) : (
              exceptions.map(exception => (
                <div key={exception.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">{exception.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(exception.date), 'dd/MM/yyyy')}
                      {exception.is_all_day ? (
                        ' - Dia inteiro'
                      ) : (
                        ` - ${exception.start_time?.substring(0, 5)} às ${exception.end_time?.substring(0, 5)}`
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {exceptionTypeNames[exception.exception_type]}
                      {exception.description && ` - ${exception.description}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteException(exception.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
