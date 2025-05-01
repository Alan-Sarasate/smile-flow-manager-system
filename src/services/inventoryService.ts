
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
  
  return data as InventoryItem[];
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
  
  return data as InventoryItem[];
};

// Função para atualizar a quantidade de um item do inventário
export const updateInventoryQuantity = async (itemId: string, newQuantity: number): Promise<boolean> => {
  // Primeiro, buscamos o item atual para calcular o novo status
  const { data: currentItem, error: fetchError } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', itemId)
    .single();

  if (fetchError || !currentItem) {
    console.error('Error fetching item for update:', fetchError);
    return false;
  }

  // Calcular o novo status baseado na quantidade e no mínimo
  let status: 'ok' | 'low' | 'critical' = 'ok';
  if (newQuantity <= currentItem.minimum_quantity * 0.3) {
    status = 'critical';
  } else if (newQuantity <= currentItem.minimum_quantity * 0.8) {
    status = 'low';
  }

  // Atualizar o item
  const { error: updateError } = await supabase
    .from('inventory')
    .update({
      quantity: newQuantity,
      status: status,
      last_purchased: newQuantity > currentItem.quantity ? new Date().toISOString() : currentItem.last_purchased,
      updated_at: new Date().toISOString()
    })
    .eq('id', itemId);

  if (updateError) {
    console.error('Error updating inventory:', updateError);
    return false;
  }

  return true;
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
