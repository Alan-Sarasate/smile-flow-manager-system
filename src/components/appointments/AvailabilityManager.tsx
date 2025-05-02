import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from "@/components/ui/switch"
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getAvailabilitySettings, updateAvailabilitySetting, createAvailabilitySetting, getAvailabilityExceptions, createAvailabilityException, updateAvailabilityException, deleteAvailabilityException } from '@/services/appointmentService';
import { AvailabilitySetting, AvailabilityException } from '@/types/supabase';
import { format, parse } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker"
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const AvailabilityManager = () => {
  const [settings, setSettings] = useState<AvailabilitySetting[]>([]);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>([]);
  const [newSetting, setNewSetting] = useState<{
    day_of_week: number | undefined;
    start_time: string;
    end_time: string;
    interval_minutes: number;
    is_available: boolean;
  }>({
    day_of_week: undefined,
    start_time: '',
    end_time: '',
    interval_minutes: 30,
    is_available: true
  });
  const [newException, setNewException] = useState<{
    title: string;
    date: Date | undefined;
    start_time: string;
    end_time: string;
    is_all_day: boolean;
    exception_type: string;
    description: string;
  }>({
    title: '',
    date: undefined,
    start_time: '',
    end_time: '',
    is_all_day: false,
    exception_type: 'block',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const daysOfWeek = [
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' }
  ];
  
  const exceptionTypes = [
    { value: 'block', label: 'Bloqueio' },
    { value: 'holiday', label: 'Feriado' },
    { value: 'personal', label: 'Pessoal' },
    { value: 'other', label: 'Outro' }
  ];
  
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getAvailabilitySettings();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching availability settings:', error);
      toast.error('Erro ao carregar configurações de disponibilidade');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExceptions = async () => {
    setLoading(true);
    try {
      const data = await getAvailabilityExceptions();
      setExceptions(data);
    } catch (error) {
      console.error('Error fetching availability exceptions:', error);
      toast.error('Erro ao carregar exceções de disponibilidade');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSettings();
    fetchExceptions();
  }, []);
  
  const handleSettingChange = async (id: string, setting: Partial<AvailabilitySetting>) => {
    try {
      const result = await updateAvailabilitySetting(id, setting);
      if (result.success) {
        toast.success('Configuração de disponibilidade atualizada com sucesso');
        fetchSettings(); // Refresh settings
      } else {
        toast.error('Erro ao atualizar configuração de disponibilidade');
      }
    } catch (error) {
      console.error('Error updating availability setting:', error);
      toast.error('Erro ao atualizar configuração de disponibilidade');
    }
  };
  
  const handleAddNewSetting = async () => {
    try {
      if (!newSetting.day_of_week || !newSetting.start_time || !newSetting.end_time) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      // Make sure all required fields are provided
      const settingToCreate: Omit<AvailabilitySetting, "id" | "created_at" | "updated_at"> = {
        day_of_week: newSetting.day_of_week,
        start_time: newSetting.start_time,
        end_time: newSetting.end_time,
        interval_minutes: newSetting.interval_minutes || 30,
        is_available: newSetting.is_available !== undefined ? newSetting.is_available : true
      };
      
      const result = await createAvailabilitySetting(settingToCreate);
      
      if (result.success) {
        setNewSetting({
          day_of_week: undefined,
          start_time: '',
          end_time: '',
          interval_minutes: 30,
          is_available: true
        });
        
        // Refresh settings
        fetchSettings();
        
        toast.success("Configuração de disponibilidade adicionada com sucesso");
      } else {
        toast.error("Erro ao adicionar configuração de disponibilidade");
      }
    } catch (error) {
      console.error("Error creating availability setting:", error);
      toast.error("Erro ao adicionar configuração de disponibilidade");
    }
  };
  
  const handleExceptionChange = async (id: string, exception: Partial<AvailabilityException>) => {
    try {
      const result = await updateAvailabilityException(id, exception);
      if (result.success) {
        toast.success('Exceção de disponibilidade atualizada com sucesso');
        fetchExceptions(); // Refresh exceptions
      } else {
        toast.error('Erro ao atualizar exceção de disponibilidade');
      }
    } catch (error) {
      console.error('Error updating availability exception:', error);
      toast.error('Erro ao atualizar exceção de disponibilidade');
    }
  };
  
  const handleAddNewException = async () => {
    try {
      if (!newException.title || !newException.date || !newException.exception_type) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      const exceptionToCreate: Omit<AvailabilityException, "id" | "created_at" | "updated_at"> = {
        title: newException.title,
        date: format(newException.date, 'yyyy-MM-dd'),
        start_time: newException.start_time || null,
        end_time: newException.end_time || null,
        is_all_day: newException.is_all_day || false,
        exception_type: newException.exception_type,
        description: newException.description || null
      };
      
      const result = await createAvailabilityException(exceptionToCreate);
      
      if (result.success) {
        setNewException({
          title: '',
          date: undefined,
          start_time: '',
          end_time: '',
          is_all_day: false,
          exception_type: 'block',
          description: ''
        });
        
        // Refresh exceptions
        fetchExceptions();
        
        toast.success("Exceção de disponibilidade adicionada com sucesso");
      } else {
        toast.error("Erro ao adicionar exceção de disponibilidade");
      }
    } catch (error) {
      console.error("Error creating availability exception:", error);
      toast.error("Erro ao adicionar exceção de disponibilidade");
    }
  };
  
  const handleDeleteException = async (id: string) => {
    try {
      const result = await deleteAvailabilityException(id);
      if (result.success) {
        toast.success('Exceção de disponibilidade removida com sucesso');
        fetchExceptions(); // Refresh exceptions
      } else {
        toast.error('Erro ao remover exceção de disponibilidade');
      }
    } catch (error) {
      console.error('Error deleting availability exception:', error);
      toast.error('Erro ao remover exceção de disponibilidade');
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Disponibilidade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando configurações...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.map((setting) => (
                <div key={setting.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`day-${setting.id}`}>Dia da Semana</Label>
                    <Select value={setting.day_of_week.toString()} onValueChange={(value) => handleSettingChange(setting.id, { day_of_week: parseInt(value) })}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`start-${setting.id}`}>Hora de Início</Label>
                    <Input
                      type="time"
                      id={`start-${setting.id}`}
                      value={setting.start_time}
                      onChange={(e) => handleSettingChange(setting.id, { start_time: e.target.value })}
                      className="max-w-[180px]"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`end-${setting.id}`}>Hora de Término</Label>
                    <Input
                      type="time"
                      id={`end-${setting.id}`}
                      value={setting.end_time}
                      onChange={(e) => handleSettingChange(setting.id, { end_time: e.target.value })}
                      className="max-w-[180px]"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`interval-${setting.id}`}>Intervalo (min)</Label>
                    <Input
                      type="number"
                      id={`interval-${setting.id}`}
                      value={setting.interval_minutes.toString()}
                      onChange={(e) => handleSettingChange(setting.id, { interval_minutes: parseInt(e.target.value) })}
                      className="max-w-[180px]"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`available-${setting.id}`}>Disponível</Label>
                    <Switch
                      id={`available-${setting.id}`}
                      checked={setting.is_available}
                      onCheckedChange={(checked) => handleSettingChange(setting.id, { is_available: checked })}
                    />
                  </div>
                </div>
              ))}
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium">Adicionar Nova Configuração</h4>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-day">Dia da Semana</Label>
                  <Select value={newSetting.day_of_week?.toString()} onValueChange={(value) => setNewSetting({ ...newSetting, day_of_week: parseInt(value) })}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-start">Hora de Início</Label>
                  <Input
                    type="time"
                    id="new-start"
                    value={newSetting.start_time}
                    onChange={(e) => setNewSetting({ ...newSetting, start_time: e.target.value })}
                    className="max-w-[180px]"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-end">Hora de Término</Label>
                  <Input
                    type="time"
                    id="new-end"
                    value={newSetting.end_time}
                    onChange={(e) => setNewSetting({ ...newSetting, end_time: e.target.value })}
                    className="max-w-[180px]"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-interval">Intervalo (min)</Label>
                  <Input
                    type="number"
                    id="new-interval"
                    value={newSetting.interval_minutes.toString()}
                    onChange={(e) => setNewSetting({ ...newSetting, interval_minutes: parseInt(e.target.value) })}
                    className="max-w-[180px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-available">Disponível</Label>
                  <Switch
                    id="new-available"
                    checked={newSetting.is_available}
                    onCheckedChange={(checked) => setNewSetting({ ...newSetting, is_available: checked })}
                  />
                </div>
                <Button onClick={handleAddNewSetting} className="w-full mt-4">Adicionar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Exceções de Disponibilidade</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando exceções...</p>
          ) : (
            <div className="space-y-4">
              {exceptions.map((exception) => (
                <div key={exception.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`title-${exception.id}`}>Título</Label>
                    <Input
                      type="text"
                      id={`title-${exception.id}`}
                      value={exception.title}
                      onChange={(e) => handleExceptionChange(exception.id, { title: e.target.value })}
                      className="max-w-[200px]"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`date-${exception.id}`}>Data</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[200px] justify-start text-left font-normal",
                            !exception.date && "text-muted-foreground"
                          )}
                        >
                          {exception.date ? (
                            format(new Date(exception.date), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <DatePicker
                          mode="single"
                          selected={exception.date ? new Date(exception.date) : undefined}
                          onSelect={(date) => date && handleExceptionChange(exception.id, { date: format(date, 'yyyy-MM-dd') })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`start-${exception.id}`}>Hora de Início</Label>
                    <Input
                      type="time"
                      id={`start-${exception.id}`}
                      value={exception.start_time || ''}
                      onChange={(e) => handleExceptionChange(exception.id, { start_time: e.target.value })}
                      className="max-w-[200px]"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`end-${exception.id}`}>Hora de Término</Label>
                    <Input
                      type="time"
                      id={`end-${exception.id}`}
                      value={exception.end_time || ''}
                      onChange={(e) => handleExceptionChange(exception.id, { end_time: e.target.value })}
                      className="max-w-[200px]"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`all-day-${exception.id}`}>Dia Todo</Label>
                    <Switch
                      id={`all-day-${exception.id}`}
                      checked={exception.is_all_day || false}
                      onCheckedChange={(checked) => handleExceptionChange(exception.id, { is_all_day: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`type-${exception.id}`}>Tipo</Label>
                    <Select value={exception.exception_type} onValueChange={(value) => handleExceptionChange(exception.id, { exception_type: value })}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {exceptionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor={`description-${exception.id}`}>Descrição</Label>
                    <Input
                      type="text"
                      id={`description-${exception.id}`}
                      value={exception.description || ''}
                      onChange={(e) => handleExceptionChange(exception.id, { description: e.target.value })}
                      className="max-w-[200px]"
                    />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteException(exception.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              ))}
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium">Adicionar Nova Exceção</h4>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-title">Título</Label>
                  <Input
                    type="text"
                    id="new-title"
                    value={newException.title}
                    onChange={(e) => setNewException({ ...newException, title: e.target.value })}
                    className="max-w-[200px]"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-date">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !newException.date && "text-muted-foreground"
                        )}
                      >
                        {newException.date ? (
                          format(newException.date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DatePicker
                        mode="single"
                        selected={newException.date}
                        onSelect={setDate => setNewException({ ...newException, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-start">Hora de Início</Label>
                  <Input
                    type="time"
                    id="new-start"
                    value={newException.start_time}
                    onChange={(e) => setNewException({ ...newException, start_time: e.target.value })}
                    className="max-w-[200px]"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-end">Hora de Término</Label>
                  <Input
                    type="time"
                    id="new-end"
                    value={newException.end_time}
                    onChange={(e) => setNewException({ ...newException, end_time: e.target.value })}
                    className="max-w-[200px]"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-all-day">Dia Todo</Label>
                  <Switch
                    id="new-all-day"
                    checked={newException.is_all_day}
                    onCheckedChange={(checked) => setNewException({ ...newException, is_all_day: checked })}
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-type">Tipo</Label>
                  <Select value={newException.exception_type} onValueChange={(value) => setNewException({ ...newException, exception_type: value })}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {exceptionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="new-description">Descrição</Label>
                  <Input
                    type="text"
                    id="new-description"
                    value={newException.description}
                    onChange={(e) => setNewException({ ...newException, description: e.target.value })}
                    className="max-w-[200px]"
                  />
                </div>
                <Button onClick={handleAddNewException} className="w-full">Adicionar</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilityManager;
