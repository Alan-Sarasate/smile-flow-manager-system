
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserRound, Search, Plus, Phone, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Mock clients for development
const mockClients = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    entry_date: '15/01/2023',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(11) 91234-5678',
    entry_date: '22/03/2023',
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    phone: '(11) 99876-5432',
    entry_date: '07/06/2023',
  },
  {
    id: '4',
    name: 'Ana Lima',
    email: 'ana.lima@email.com',
    phone: '(11) 98888-7777',
    entry_date: '12/09/2023',
  },
  {
    id: '5',
    name: 'Roberto Ferreira',
    email: 'roberto.ferreira@email.com',
    phone: '(11) 97777-8888',
    entry_date: '30/11/2023',
  }
];

const Clients = () => {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // In the future, we'll replace this with real Supabase calls
        // const { data, error } = await supabase
        //   .from('clients')
        //   .select('*')
        //   .order('name');
        
        // if (error) throw error;
        // setClients(data);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we're using mock data
        setClients(mockClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast.error("Erro ao carregar lista de clientes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filter clients based on search term
  const filteredClients = searchTerm
    ? clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      )
    : clients;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Gerencie todos os clientes da clínica</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              {/* New client form would go here */}
              <p>Formulário de novo cliente seria implementado aqui.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar clientes por nome, email ou telefone..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Carregando clientes...</div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">
              Nenhum cliente encontrado com os critérios de busca.
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-4 bg-muted/50 p-3 font-medium">
                <div>Nome</div>
                <div>Contato</div>
                <div>Data de Entrada</div>
                <div className="text-right">Ações</div>
              </div>
              <div className="divide-y">
                {filteredClients.map((client) => (
                  <div key={client.id} className="grid grid-cols-4 p-3 items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <UserRound className="h-5 w-5 text-primary" />
                      </div>
                      <div>{client.name}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                    <div>{client.entry_date}</div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/clients/${client.id}`}>
                          Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
