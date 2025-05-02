
export interface Appointment {
  id: string;
  client_id: string;
  client_name?: string;
  procedure_name?: string;
  date: string;
  status: string;
  professional: string;
  type?: string;
  duration?: number;
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
  cep?: string | null;
  street?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  number?: string | null;
  complement?: string | null;
  cpf?: string | null;
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
  type?: string;
  duration?: number;
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

export interface AvailabilitySetting {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  interval_minutes: number;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AvailabilityException {
  id: string;
  title: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  is_all_day?: boolean;
  exception_type: 'block' | 'holiday' | 'personal' | 'other';
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}
