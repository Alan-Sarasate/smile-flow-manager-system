
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ArrowDownCircle, ArrowUpCircle, TrendingUp } from 'lucide-react';

const FinanceSummary = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="animate-fade-in anim-delay-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 32.480</div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-green-500 flex items-center">
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              +8%
            </span>
            <span className="text-muted-foreground">comparado ao mês anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in anim-delay-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 13.920</div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-red-500 flex items-center">
              <ArrowDownCircle className="h-3 w-3 mr-1" />
              +12%
            </span>
            <span className="text-muted-foreground">comparado ao mês anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in anim-delay-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Lucro</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 18.560</div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-green-500 flex items-center">
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              +5%
            </span>
            <span className="text-muted-foreground">comparado ao mês anterior</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="animate-fade-in anim-delay-400">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">84%</div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-green-500 flex items-center">
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              +10%
            </span>
            <span className="text-muted-foreground">comparado ao mês anterior</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceSummary;
