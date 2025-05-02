
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types/supabase';

export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  
  return data || [];
};

export const searchClients = async (query: string): Promise<Client[]> => {
  if (!query || query.length < 2) {
    return [];
  }
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('name')
    .limit(10);
  
  if (error) {
    console.error('Error searching clients:', error);
    return [];
  }
  
  return data || [];
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching client by id:', error);
    return null;
  }
  
  return data;
};

export const createClient = async (client: Omit<Client, 'id' | 'entry_date'>): Promise<{ success: boolean; client?: Client; error?: any }> => {
  try {
    // Adicionar mês e ano de registro para estatísticas
    const now = new Date();
    const registrationMonth = now.getMonth() + 1; // JavaScript meses são 0-11
    const registrationYear = now.getFullYear();
    
    const { data, error } = await supabase
      .from('clients')
      .insert({
        ...client,
        is_new: true,
        registration_month: registrationMonth,
        registration_year: registrationYear
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating client:', error);
      return { success: false, error };
    }
    
    return { success: true, client: data };
  } catch (error) {
    console.error('Error creating client:', error);
    return { success: false, error };
  }
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<{ success: boolean; client?: Client; error?: any }> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(client)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating client:', error);
      return { success: false, error };
    }
    
    return { success: true, client: data };
  } catch (error) {
    console.error('Error updating client:', error);
    return { success: false, error };
  }
};
