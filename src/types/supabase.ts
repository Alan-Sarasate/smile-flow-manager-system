
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
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  entry_date: string;
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
