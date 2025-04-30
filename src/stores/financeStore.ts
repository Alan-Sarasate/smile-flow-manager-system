
import { create } from 'zustand';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Transaction {
  id: string;
  description: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  payment_method?: string;
  payment_status?: string;
}

interface FinanceState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  filter: 'all' | 'income' | 'expense';
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  fetchTransactions: () => Promise<void>;
  setFilter: (filter: 'all' | 'income' | 'expense') => void;
  setPeriod: (period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom') => void;
  summary: {
    revenue: number;
    expenses: number;
    profit: number;
    occupancyRate: number;
  };
  calculateSummary: () => void;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,
  filter: 'all',
  period: 'month',
  summary: {
    revenue: 0,
    expenses: 0,
    profit: 0,
    occupancyRate: 0,
  },
  
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      // For now, we'll simulate data from our existing mock transactions
      // Later, this will be replaced with real Supabase calls
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          date: '27/04/2025',
          description: 'Consulta - João Silva',
          category: 'Consulta',
          amount: 150,
          type: 'income',
          payment_method: 'Cartão de Crédito',
          payment_status: 'Confirmado',
        },
        {
          id: '2',
          date: '26/04/2025',
          description: 'Compra de materiais dentários',
          category: 'Suprimentos',
          amount: 450,
          type: 'expense',
          payment_method: 'Transferência',
          payment_status: 'Confirmado',
        },
        {
          id: '3',
          date: '25/04/2025',
          description: 'Clareamento - Maria Oliveira',
          category: 'Procedimento',
          amount: 800,
          type: 'income',
          payment_method: 'Dinheiro',
          payment_status: 'Confirmado',
        },
        {
          id: '4',
          date: '24/04/2025',
          description: 'Manutenção equipamento',
          category: 'Manutenção',
          amount: 320,
          type: 'expense',
          payment_method: 'Boleto',
          payment_status: 'Confirmado',
        },
        {
          id: '5',
          date: '23/04/2025',
          description: 'Implante - Carlos Santos',
          category: 'Procedimento',
          amount: 2500,
          type: 'income',
          payment_method: 'Cartão de Crédito',
          payment_status: 'Confirmado',
        },
        {
          id: '6',
          date: '23/04/2025',
          description: 'Pagamento funcionários',
          category: 'Salários',
          amount: 3200,
          type: 'expense',
          payment_method: 'Transferência',
          payment_status: 'Confirmado',
        },
        {
          id: '7',
          date: '22/04/2025',
          description: 'Conta de energia',
          category: 'Utilidades',
          amount: 380,
          type: 'expense',
          payment_method: 'Débito Automático',
          payment_status: 'Confirmado',
        },
      ];

      // Future implementation will use Supabase:
      // const { data, error } = await supabase
      //   .from('payments')
      //   .select('*')
      //   .order('payment_date', { ascending: false });

      set({ transactions: mockTransactions, isLoading: false });
      get().calculateSummary();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ error: "Failed to fetch transactions", isLoading: false });
      toast.error("Falha ao carregar transações");
    }
  },
  
  setFilter: (filter) => set({ filter }),
  setPeriod: (period) => set({ period }),
  
  calculateSummary: () => {
    const { transactions } = get();
    
    const revenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
      
    const profit = revenue - expenses;
    
    // This is a placeholder calculation - in reality it would be based on appointment data
    const occupancyRate = 84;
    
    set({
      summary: {
        revenue,
        expenses,
        profit,
        occupancyRate
      }
    });
  }
}));
