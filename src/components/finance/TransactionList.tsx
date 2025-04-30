
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

const transactions: Transaction[] = [
  {
    id: 1,
    date: '27/04/2025',
    description: 'Consulta - João Silva',
    category: 'Consulta',
    amount: 150,
    type: 'income'
  },
  {
    id: 2,
    date: '26/04/2025',
    description: 'Compra de materiais dentários',
    category: 'Suprimentos',
    amount: 450,
    type: 'expense'
  },
  {
    id: 3,
    date: '25/04/2025',
    description: 'Clareamento - Maria Oliveira',
    category: 'Procedimento',
    amount: 800,
    type: 'income'
  },
  {
    id: 4,
    date: '24/04/2025',
    description: 'Manutenção equipamento',
    category: 'Manutenção',
    amount: 320,
    type: 'expense'
  },
  {
    id: 5,
    date: '23/04/2025',
    description: 'Implante - Carlos Santos',
    category: 'Procedimento',
    amount: 2500,
    type: 'income'
  },
  {
    id: 6,
    date: '23/04/2025',
    description: 'Pagamento funcionários',
    category: 'Salários',
    amount: 3200,
    type: 'expense'
  },
  {
    id: 7,
    date: '22/04/2025',
    description: 'Conta de energia',
    category: 'Utilidades',
    amount: 380,
    type: 'expense'
  },
];

const TransactionList = () => {
  const [filter, setFilter] = React.useState('all');

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Select defaultValue="all" onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Transações</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select defaultValue="month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Este Mês</SelectItem>
              <SelectItem value="quarter">Este Trimestre</SelectItem>
              <SelectItem value="year">Este Ano</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar transação..." 
            className="pl-9 w-full md:w-[300px]" 
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="grid grid-cols-5 bg-muted/50 p-3 font-medium">
          <div>Data</div>
          <div className="col-span-2">Descrição</div>
          <div>Categoria</div>
          <div className="text-right">Valor</div>
        </div>
        <div className="divide-y">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="grid grid-cols-5 p-3 items-center">
              <div>{transaction.date}</div>
              <div className="col-span-2">{transaction.description}</div>
              <div>
                <Badge variant="outline">{transaction.category}</Badge>
              </div>
              <div className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.type === 'income' ? '+' : '-'} R$ {transaction.amount.toFixed(2).replace('.', ',')}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Exibindo {filteredTransactions.length} de {transactions.length} transações
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled>Anterior</Button>
          <Button variant="outline" size="sm">Próxima</Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
