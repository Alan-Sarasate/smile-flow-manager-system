import { supabase } from '@/integrations/supabase/client';
import { Appointment, AvailabilitySetting, AvailabilityException } from '@/types/supabase';
import { format, parse, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  const today = new Date().toISOString();
  
  // First get procedures which represent appointments
  const { data: procedures, error: procedureError } = await supabase
    .from('procedures')
    .select('id, name, date, status, client_id, professional, type, duration')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(5);
  
  if (procedureError) {
    console.error('Error fetching appointments:', procedureError);
    return [];
  }
  
  // Then fetch client names for those procedures
  if (procedures && procedures.length > 0) {
    const clientIds = procedures.map(proc => proc.client_id);
    
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('id, name')
      .in('id', clientIds);
    
    if (clientError) {
      console.error('Error fetching clients:', clientError);
      return procedures.map(proc => ({
        id: proc.id,
        client_id: proc.client_id,
        procedure_name: proc.name,
        date: proc.date,
        status: proc.status,
        professional: proc.professional || '',
        type: proc.type,
        duration: proc.duration
      }));
    }
    
    // Map client names to appointments
    return procedures.map(proc => {
      const client = clients?.find(c => c.id === proc.client_id);
      return {
        id: proc.id,
        client_id: proc.client_id,
        client_name: client?.name || 'Cliente não identificado',
        procedure_name: proc.name,
        date: proc.date,
        status: proc.status,
        professional: proc.professional || '',
        type: proc.type,
        duration: proc.duration
      };
    });
  }
  
  return [];
};

export const getDailyAppointments = async (date: Date): Promise<Appointment[]> => {
  // Format as YYYY-MM-DD for date comparison
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  // Get procedures for the selected date
  const { data: procedures, error: procedureError } = await supabase
    .from('procedures')
    .select('id, name, date, status, client_id, professional, type, duration')
    .gte('date', startDate.toISOString())
    .lt('date', endDate.toISOString())
    .order('date', { ascending: true });
  
  if (procedureError) {
    console.error('Error fetching daily appointments:', procedureError);
    return [];
  }
  
  // If no appointments, return empty array
  if (!procedures || procedures.length === 0) {
    return [];
  }
  
  // Then fetch client names
  const clientIds = procedures.map(proc => proc.client_id);
    
  const { data: clients, error: clientError } = await supabase
    .from('clients')
    .select('id, name')
    .in('id', clientIds);
  
  if (clientError) {
    console.error('Error fetching clients for appointments:', clientError);
    return procedures.map(proc => ({
      id: proc.id,
      client_id: proc.client_id,
      procedure_name: proc.name,
      date: proc.date,
      status: proc.status,
      professional: proc.professional || '',
      type: proc.type,
      duration: proc.duration
    }));
  }
  
  // Map client names to appointments
  return procedures.map(proc => {
    const client = clients?.find(c => c.id === proc.client_id);
    return {
      id: proc.id,
      client_id: proc.client_id,
      client_name: client?.name || 'Cliente não identificado',
      procedure_name: proc.name,
      date: proc.date,
      status: proc.status,
      professional: proc.professional || '',
      type: proc.type,
      duration: proc.duration
    };
  });
};

export const createAppointment = async (appointmentData: {
  client_id: string;
  name: string;
  date: Date;
  status: string;
  price: number;
  professional: string;
  type: string;
  duration?: number;
  notes?: string;
}): Promise<{ success: boolean; appointment?: Appointment; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('procedures')
      .insert({
        client_id: appointmentData.client_id,
        name: appointmentData.name,
        date: appointmentData.date.toISOString(),
        status: appointmentData.status,
        price: appointmentData.price,
        professional: appointmentData.professional,
        type: appointmentData.type,
        duration: appointmentData.duration || 30,
        notes: appointmentData.notes
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating appointment:', error);
      return { success: false, error };
    }
    
    return { 
      success: true, 
      appointment: {
        id: data.id,
        client_id: data.client_id,
        procedure_name: data.name,
        date: data.date,
        status: data.status,
        professional: data.professional,
        type: data.type,
        duration: data.duration
      }
    };
  } catch (error) {
    console.error('Error creating appointment:', error);
    return { success: false, error };
  }
};

export const updateAppointment = async (id: string, appointmentData: {
  name?: string;
  date?: Date;
  status?: string;
  price?: number;
  professional?: string;
  type?: string;
  duration?: number;
  notes?: string;
}): Promise<{ success: boolean; appointment?: Appointment; error?: any }> => {
  try {
    // Convert date to ISO if present
    const updateData = { ...appointmentData };
    if (updateData.date) {
      updateData.date = updateData.date.toISOString();
    }
    
    const { data, error } = await supabase
      .from('procedures')
      .update(updateData as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating appointment:', error);
      return { success: false, error };
    }
    
    return { 
      success: true, 
      appointment: {
        id: data.id,
        client_id: data.client_id,
        procedure_name: data.name,
        date: data.date,
        status: data.status,
        professional: data.professional,
        type: data.type,
        duration: data.duration
      }
    };
  } catch (error) {
    console.error('Error updating appointment:', error);
    return { success: false, error };
  }
};

export const cancelAppointment = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('procedures')
      .update({ status: 'cancelled' })
      .eq('id', id);
    
    if (error) {
      console.error('Error cancelling appointment:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return { success: false, error };
  }
};

export const deleteAppointment = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('procedures')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting appointment:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error };
  }
};

// Availability settings
export const getAvailabilitySettings = async (): Promise<AvailabilitySetting[]> => {
  const { data, error } = await supabase
    .from('availability_settings')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching availability settings:', error);
    return [];
  }
  
  return data || [];
};

export const updateAvailabilitySetting = async (id: string, setting: Partial<AvailabilitySetting>): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('availability_settings')
      .update(setting)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating availability setting:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating availability setting:', error);
    return { success: false, error };
  }
};

export const createAvailabilitySetting = async (setting: Omit<AvailabilitySetting, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('availability_settings')
      .insert(setting);
    
    if (error) {
      console.error('Error creating availability setting:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating availability setting:', error);
    return { success: false, error };
  }
};

// Availability exceptions
export const getAvailabilityExceptions = async (): Promise<AvailabilityException[]> => {
  const { data, error } = await supabase
    .from('availability_exceptions')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching availability exceptions:', error);
    return [];
  }
  
  return (data as AvailabilityException[]) || [];
};

export const createAvailabilityException = async (exception: Omit<AvailabilityException, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('availability_exceptions')
      .insert(exception);
    
    if (error) {
      console.error('Error creating availability exception:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error creating availability exception:', error);
    return { success: false, error };
  }
};

export const updateAvailabilityException = async (id: string, exception: Partial<AvailabilityException>): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('availability_exceptions')
      .update(exception)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating availability exception:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating availability exception:', error);
    return { success: false, error };
  }
};

export const deleteAvailabilityException = async (id: string): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('availability_exceptions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting availability exception:', error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting availability exception:', error);
    return { success: false, error };
  }
};

// Helpers para disponibilidade de horários
export const getAvailableTimeSlotsForDate = async (date: Date): Promise<{time: string; available: boolean}[]> => {
  // 1. Obter configurações padrão para o dia da semana
  const dayOfWeek = date.getDay(); // 0 = domingo, 1 = segunda, etc.
  
  const { data: settingsData, error: settingsError } = await supabase
    .from('availability_settings')
    .select('*')
    .eq('day_of_week', dayOfWeek);
  
  if (settingsError || !settingsData || settingsData.length === 0) {
    console.error('Error fetching availability settings or no settings found:', settingsError);
    return [];
  }
  
  // Se não houver configurações ou o dia não estiver disponível
  const settings = settingsData[0];
  if (!settings.is_available) {
    return [];
  }
  
  // 2. Checar exceções para a data
  const dateStr = format(date, 'yyyy-MM-dd');
  
  const { data: exceptionsData, error: exceptionsError } = await supabase
    .from('availability_exceptions')
    .select('*')
    .eq('date', dateStr);
  
  if (exceptionsError) {
    console.error('Error fetching availability exceptions:', exceptionsError);
  }
  
  // Se há uma exceção para o dia todo, não há horários disponíveis
  const fullDayException = exceptionsData?.find(e => e.is_all_day);
  if (fullDayException) {
    return [];
  }
  
  // 3. Gerar slots de tempo baseados nas configurações
  const timeSlots: {time: string; available: boolean}[] = [];
  
  for (const setting of settingsData) {
    if (!setting.is_available) continue;
    
    const startTime = parse(setting.start_time, 'HH:mm:ss', new Date());
    const endTime = parse(setting.end_time, 'HH:mm:ss', new Date());
    
    let currentSlot = startTime;
    
    while (currentSlot < endTime) {
      const timeStr = format(currentSlot, 'HH:mm');
      let available = true;
      
      // Verificar se o horário está em alguma exceção parcial
      const slotExceptions = exceptionsData?.filter(e => !e.is_all_day);
      if (slotExceptions && slotExceptions.length > 0) {
        for (const exception of slotExceptions) {
          if (!exception.start_time || !exception.end_time) continue;
          
          const exStartTime = parse(exception.start_time, 'HH:mm:ss', new Date());
          const exEndTime = parse(exception.end_time, 'HH:mm:ss', new Date());
          
          if (currentSlot >= exStartTime && currentSlot < exEndTime) {
            available = false;
            break;
          }
        }
      }
      
      // 4. Verificar se já há agendamentos para esse horário
      // Implementar consulta de agendamentos existentes
      
      timeSlots.push({
        time: timeStr,
        available
      });
      
      // Avançar para o próximo slot
      currentSlot = addMinutes(currentSlot, setting.interval_minutes);
    }
  }
  
  // 5. Verificar agendamentos existentes
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const { data: appointments, error: appointmentsError } = await supabase
    .from('procedures')
    .select('date, duration')
    .gte('date', startOfDay.toISOString())
    .lt('date', endOfDay.toISOString())
    .not('status', 'eq', 'cancelled');
  
  if (appointmentsError) {
    console.error('Error fetching existing appointments:', appointmentsError);
  } else if (appointments && appointments.length > 0) {
    // Marcar slots já ocupados
    for (const appointment of appointments) {
      const appTime = new Date(appointment.date);
      const appTimeStr = format(appTime, 'HH:mm');
      
      // Marcar o slot inicial e os slots subsequentes baseados na duração
      const duration = appointment.duration || 30;
      const numSlots = Math.ceil(duration / 30); // Assumindo que os slots são de 30 minutos
      
      for (let i = 0; i < timeSlots.length; i++) {
        if (timeSlots[i].time === appTimeStr) {
          // Marcar este slot e os próximos slots baseados na duração
          for (let j = 0; j < numSlots && i + j < timeSlots.length; j++) {
            timeSlots[i + j].available = false;
          }
          break;
        }
      }
    }
  }
  
  return timeSlots;
};
