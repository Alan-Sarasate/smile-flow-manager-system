
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/types/supabase';

// Função para buscar todo o inventário
export const getInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
  
  return data || [];
};

// Função para buscar itens de inventário críticos e com estoque baixo
export const getCriticalInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .or('status.eq.critical,status.eq.low')
    .order('quantity', { ascending: true })
    .limit(5);
    
  if (error) {
    console.error('Error fetching critical inventory:', error);
    return [];
  }
  
  return data || [];
};

// Função temporária de backup caso haja problemas com o Supabase
export const getMockCriticalInventory = (): InventoryItem[] => {
  return [
    {
      id: '1',
      name: 'Resina Z350',
      quantity: 2,
      minimum_quantity: 5,
      category: 'Materiais',
      cost: 120.50,
      status: 'critical'
    },
    {
      id: '2',
      name: 'Anestésico',
      quantity: 5,
      minimum_quantity: 10,
      category: 'Medicamentos',
      cost: 45.75,
      status: 'critical'
    },
    {
      id: '3',
      name: 'Alginato',
      quantity: 8,
      minimum_quantity: 10,
      category: 'Materiais',
      cost: 35.20,
      status: 'low'
    }
  ];
};
