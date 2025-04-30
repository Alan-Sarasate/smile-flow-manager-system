
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useFinanceStore } from '@/stores/financeStore';

const TransactionList = () => {
  const { 
    transactions, 
    filter, 
    period, 
    setFilter, 
    setPeriod,
    fetchTransactions,
    isLoading 
  } = useFinanceStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Transações</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={(value) => setPeriod(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoje</SelectItem>
              <SelectItem value="week">Esta Semana</SelectItem>
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
      
      {isLoading ? (
        <div className="flex justify-center p-8">Carregando transações...</div>
      ) : (
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
      )}
      
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
