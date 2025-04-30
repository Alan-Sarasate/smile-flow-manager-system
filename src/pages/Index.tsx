
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-dental-blue">DentalClinic</span>
          </div>
          <div>
            <Link to="/booking">
              <Button variant="outline" className="mr-2">Agendar Consulta</Button>
            </Link>
            <Link to="/dashboard">
              <Button>Área Administrativa</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="bg-gradient-to-r from-dental-blue to-dental-teal text-white py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Sistema de Gestão para Consultórios Odontológicos
              </h1>
              <p className="text-lg opacity-90">
                Gerencie agendamentos, finanças e estoque em uma única plataforma intuitiva.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard">
                  <Button size="lg" variant="secondary">
                    Acessar Dashboard
                  </Button>
                </Link>
                <Link to="/booking">
                  <Button size="lg" variant="outline" className="bg-white/10">
                    Agendamento de Pacientes
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="text-dental-blue font-medium text-lg mb-4">Acesso Rápido</div>
                <div className="space-y-3">
                  <Link to="/appointments" className="block p-3 bg-dental-gray rounded-md hover:bg-dental-light-blue transition-colors text-dental-dark">
                    Gerenciar Agendamentos
                  </Link>
                  <Link to="/finance" className="block p-3 bg-dental-gray rounded-md hover:bg-dental-light-blue transition-colors text-dental-dark">
                    Gestão Financeira
                  </Link>
                  <Link to="/inventory" className="block p-3 bg-dental-gray rounded-md hover:bg-dental-light-blue transition-colors text-dental-dark">
                    Controle de Estoque
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-dental-gray/10 p-6 rounded-lg">
                <div className="bg-dental-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dental-blue h-8 w-8"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Agendamento Inteligente</h3>
                <p className="text-muted-foreground">
                  Gerencie os horários disponíveis, controle conflitos e ofereça agendamento online para seus pacientes.
                </p>
              </div>
              
              <div className="bg-dental-gray/10 p-6 rounded-lg">
                <div className="bg-dental-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dental-blue h-8 w-8"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Controle Financeiro</h3>
                <p className="text-muted-foreground">
                  Acompanhe receitas, despesas e fluxo de caixa da clínica com relatórios detalhados e análises.
                </p>
              </div>
              
              <div className="bg-dental-gray/10 p-6 rounded-lg">
                <div className="bg-dental-blue/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dental-blue h-8 w-8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Gestão de Estoque</h3>
                <p className="text-muted-foreground">
                  Monitore o estoque de materiais, receba alertas de baixo estoque e controle produtos com data de validade.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dental-dark text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="font-bold text-lg">DentalClinic</h3>
              <p className="text-sm opacity-75">Sistema de Gestão para Consultórios Odontológicos</p>
            </div>
            <div className="flex gap-4">
              <Link to="/dashboard" className="opacity-75 hover:opacity-100">Dashboard</Link>
              <Link to="/appointments" className="opacity-75 hover:opacity-100">Agendamentos</Link>
              <Link to="/booking" className="opacity-75 hover:opacity-100">Área do Cliente</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm opacity-75">
            <p>&copy; 2025 DentalClinic. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
