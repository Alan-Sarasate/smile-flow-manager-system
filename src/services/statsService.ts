
import { supabase } from '@/integrations/supabase/client';
import { MonthlyStat } from '@/types/supabase';

// Função para buscar estatísticas do mês atual
export const getCurrentMonthStats = async (): Promise<MonthlyStat | null> => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript meses são 0-11
  const currentYear = currentDate.getFullYear();
  
  const { data, error } = await supabase
    .from('monthly_stats')
    .select('*')
    .eq('month', currentMonth)
    .eq('year', currentYear)
    .single();
    
  if (error) {
    console.error('Error fetching monthly stats:', error);
    return null;
  }
  
  return data;
};

// Função para buscar o número de novos pacientes do mês atual
export const getNewPatients = async (): Promise<number> => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; 
  const currentYear = currentDate.getFullYear();
  
  const { count, error } = await supabase
    .from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('is_new', true)
    .eq('registration_month', currentMonth)
    .eq('registration_year', currentYear);
    
  if (error) {
    console.error('Error fetching new patients:', error);
    return 0;
  }
  
  return count || 0;
};
