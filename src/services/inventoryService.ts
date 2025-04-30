
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem } from '@/types/supabase';

// Since the original schema doesn't include an inventory table,
// we'll need to add an SQL migration for this in a separate message.
// For now, I'll create a service that expects the inventory table to exist.

export const getCriticalInventory = async (): Promise<InventoryItem[]> => {
  // This will work after we add the inventory table
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .or('status.eq.critical,status.eq.low')
    .order('quantity', { ascending: true })
    .limit(5);
    
  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }
  
  return data || [];
};

// Temporary function to simulate inventory data until we create the table
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
