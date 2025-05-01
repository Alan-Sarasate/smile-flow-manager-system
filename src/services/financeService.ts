
import { supabase } from '@/integrations/supabase/client';
import { FinancialTransaction } from '@/types/supabase';

// Função para buscar transações financeiras
export const getTransactions = async (): Promise<FinancialTransaction[]> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .order('transaction_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
  
  return data;
};

// Função para calcular o total de receitas do mês atual
export const getMonthlyRevenue = async (): Promise<number> => {
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('amount')
    .eq('type', 'income')
    .gte('transaction_date', firstDay)
    .lte('transaction_date', lastDay);
    
  if (error) {
    console.error('Error fetching monthly revenue:', error);
    return 0;
  }
  
  return data.reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Função para calcular o total de despesas do mês atual
export const getMonthlyExpenses = async (): Promise<number> => {
  const currentDate = new Date();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('amount')
    .eq('type', 'expense')
    .gte('transaction_date', firstDay)
    .lte('transaction_date', lastDay);
    
  if (error) {
    console.error('Error fetching monthly expenses:', error);
    return 0;
  }
  
  return data.reduce((sum, transaction) => sum + transaction.amount, 0);
};
