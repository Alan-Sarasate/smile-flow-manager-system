
import { supabase } from '@/integrations/supabase/client';
import { Appointment } from '@/types/supabase';

export const getUpcomingAppointments = async (): Promise<Appointment[]> => {
  const today = new Date().toISOString();
  
  // First get procedures which represent appointments
  const { data: procedures, error: procedureError } = await supabase
    .from('procedures')
    .select('id, name, date, status, client_id, professional')
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
      };
    });
  }
  
  return [];
};
