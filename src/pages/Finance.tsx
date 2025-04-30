
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import FinanceSummary from '@/components/finance/FinanceSummary';
import TransactionList from '@/components/finance/TransactionList';
import { Plus } from 'lucide-react';

const Finance = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão Financeira</h1>
          <p className="text-muted-foreground">Acompanhe receitas, despesas e fluxo de caixa.</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              {/* Transaction form would go here */}
              <div className="p-4">Formulário de Nova Despesa</div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              {/* Transaction form would go here */}
              <div className="p-4">Formulário de Nova Receita</div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <FinanceSummary />
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted/50 p-3 font-medium">
                  <div>Paciente</div>
                  <div>Procedimento</div>
                  <div>Valor</div>
                  <div>Vencimento</div>
                  <div className="text-right">Ações</div>
                </div>
                <div className="divide-y">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-5 p-3 items-center">
                      <div>João Silva</div>
                      <div>Implante</div>
                      <div>R$ 2.500,00</div>
                      <div>{new Date().toLocaleDateString('pt-BR')}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button size="sm">Receber</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="p-8 h-auto flex flex-col gap-4 hover:bg-muted/50 transition-colors">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3 text-primary h-6 w-6"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Relatório Mensal</h3>
                    <p className="text-muted-foreground">Resumo completo das finanças do mês</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-8 h-auto flex flex-col gap-4 hover:bg-muted/50 transition-colors">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart text-primary h-6 w-6"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Análise de Procedimentos</h3>
                    <p className="text-muted-foreground">Receita por tipo de procedimento</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-8 h-auto flex flex-col gap-4 hover:bg-muted/50 transition-colors">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days text-primary h-6 w-6"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Previsão de Faturamento</h3>
                    <p className="text-muted-foreground">Projeção baseada em agendamentos</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-8 h-auto flex flex-col gap-4 hover:bg-muted/50 transition-colors">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-receipt text-primary h-6 w-6"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/></svg>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-lg">Custos e Despesas</h3>
                    <p className="text-muted-foreground">Análise detalhada de gastos</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
