
export interface Appointment {
  id: string;
  client_id: string;
  client_name?: string;
  procedure_name?: string;
  date: string;
  status: string;
  professional: string;
  type?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minimum_quantity: number;
  category: string;
  cost: number;
  last_purchased?: string;
  status: 'ok' | 'low' | 'critical';
  created_at?: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  entry_date: string;
  is_new?: boolean;
  registration_month?: number;
  registration_year?: number;
}

export interface Procedure {
  id: string;
  name: string;
  date: string;
  price: number;
  status: string;
  client_id: string;
  materials?: any;
  professional?: string | null;
}

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  transaction_date: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MonthlyStat {
  id: string;
  month: number;
  year: number;
  revenue: number;
  expenses: number;
  new_patients: number;
  occupancy_rate: number;
  created_at?: string;
  updated_at?: string;
}
