
import { supabase } from '@/integrations/supabase/client';
import { FinancialTransaction } from '@/types/supabase';

export const getFinancialTransactions = async (limit: number = 30): Promise<FinancialTransaction[]> => {
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching financial transactions:', error);
    return [];
  }
  
  // Converter o tipo string para o tipo union 'income' | 'expense'
  return data?.map(item => ({
    ...item,
    type: item.type === 'income' ? 'income' : 'expense'
  } as FinancialTransaction)) || [];
};

export const getMonthlyBalance = async (year: number, month: number): Promise<{ income: number; expense: number }> => {
  // Converter mês para 1-12
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  
  const firstDayStr = firstDayOfMonth.toISOString().split('T')[0];
  const lastDayStr = lastDayOfMonth.toISOString().split('T')[0];
  
  // Buscar todas as transações do mês
  const { data, error } = await supabase
    .from('financial_transactions')
    .select('*')
    .gte('transaction_date', firstDayStr)
    .lte('transaction_date', lastDayStr);
    
  if (error) {
    console.error('Error fetching monthly balance:', error);
    return { income: 0, expense: 0 };
  }
  
  // Calcular totais
  const income = data
    ?.filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
  const expense = data
    ?.filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
  return { income, expense };
};

export const addTransaction = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; transaction?: FinancialTransaction; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert(transaction)
      .select()
      .single();
      
    if (error) {
      console.error('Error adding transaction:', error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true,
      transaction: {
        ...data,
        type: data.type === 'income' ? 'income' : 'expense'
      } as FinancialTransaction
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    return { success: false, error: 'Erro ao adicionar transação' };
  }
};
