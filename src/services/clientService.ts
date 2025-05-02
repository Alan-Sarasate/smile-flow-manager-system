
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

// Função para buscar endereço por CEP usando a API ViaCEP
export const fetchAddressByCep = async (cep: string): Promise<{
  street?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  error?: string;
}> => {
  if (!cep || cep.replace(/\D/g, '').length !== 8) {
    return { error: 'CEP inválido' };
  }
  
  try {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { error: 'CEP não encontrado' };
    }
    
    return {
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf
    };
  } catch (error) {
    console.error('Error fetching address by CEP:', error);
    return { error: 'Erro ao buscar CEP' };
  }
};
