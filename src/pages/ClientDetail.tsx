
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  UserRound, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  FileText, 
  DollarSign,
  MessageSquare,
  Plus,
  Download,
  Pencil,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// This is a mock client for development purpose
// Later we'll replace with data from Supabase
const mockClient = {
  id: '123',
  name: 'Maria Silva',
  email: 'maria.silva@email.com',
  phone: '(11) 98765-4321',
  address: 'Rua das Flores, 123, São Paulo - SP',
  entry_date: '15/01/2023',
  notes: 'Cliente preferencial. Sensibilidade a anestésicos com epinefrina.'
};

// Mock procedures
const mockProcedures = [
  {
    id: '1',
    name: 'Limpeza Dental',
    date: '27/04/2025',
    status: 'Concluído',
    price: 120,
    professional: 'Dr. Carlos Santos',
    notes: 'Procedimento padrão sem complicações'
  },
  {
    id: '2',
    name: 'Canal',
    date: '15/03/2025',
    status: 'Em andamento',
    price: 850,
    professional: 'Dra. Ana Oliveira',
    notes: 'Primeira sessão concluída'
  },
  {
    id: '3',
    name: 'Implante',
    date: '10/02/2025',
    status: 'Agendado',
    price: 2500,
    professional: 'Dr. Roberto Ferreira',
    notes: 'Aguardando avaliação inicial'
  }
];

// Mock payments
const mockPayments = [
  {
    id: '1',
    date: '27/04/2025',
    amount: 120,
    method: 'Cartão de Crédito',
    status: 'Confirmado',
    receipt: 'https://example.com/receipt1.pdf'
  },
  {
    id: '2',
    date: '15/03/2025',
    amount: 500,
    method: 'Transferência Bancária',
    status: 'Confirmado',
    receipt: 'https://example.com/receipt2.pdf'
  },
  {
    id: '3',
    date: '10/02/2025',
    amount: 1000,
    method: 'Cartão de Débito',
    status: 'Pendente',
    receipt: null
  }
];

// Mock interactions
const mockInteractions = [
  {
    id: '1',
    type: 'Presencial',
    date: '27/04/2025',
    professional: 'Dr. Carlos Santos',
    summary: 'Consulta de avaliação inicial'
  },
  {
    id: '2',
    type: 'Telefone',
    date: '15/03/2025',
    professional: 'Dra. Ana Oliveira',
    summary: 'Confirmação de agendamento'
  },
  {
    id: '3',
    type: 'Email',
    date: '10/02/2025',
    professional: 'Atendimento',
    summary: 'Envio de orçamento de procedimentos'
  }
];

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState(mockClient);
  const [procedures, setProcedures] = useState(mockProcedures);
  const [payments, setPayments] = useState(mockPayments);
  const [interactions, setInteractions] = useState(mockInteractions);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        // In the future, we'll replace this with real Supabase calls
        // const { data, error } = await supabase
        //   .from('clients')
        //   .select('*')
        //   .eq('id', id)
        //   .single();
        
        // if (error) throw error;
        // setClient(data);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, we're using mock data
        setClient(mockClient);
        setProcedures(mockProcedures);
        setPayments(mockPayments);
        setInteractions(mockInteractions);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast.error("Erro ao carregar dados do cliente");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchClientData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Carregando dados do cliente...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
          <p className="text-muted-foreground">Perfil completo e histórico do cliente</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Pencil className="h-4 w-4" /> Editar
          </Button>
          <Button variant="destructive" className="flex items-center gap-1">
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      {/* Client Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{client.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{client.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{client.phone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{client.address}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">{client.entry_date}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Observações</p>
                  <p className="font-medium">{client.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="procedures" className="w-full">
        <TabsList>
          <TabsTrigger value="procedures">Procedimentos</TabsTrigger>
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="interactions">Interações</TabsTrigger>
        </TabsList>
        
        {/* Procedures Tab */}
        <TabsContent value="procedures" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Novo Procedimento
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Procedimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-3 font-medium">
                  <div>Data</div>
                  <div>Procedimento</div>
                  <div>Profissional</div>
                  <div>Valor</div>
                  <div>Status</div>
                  <div className="text-right">Ações</div>
                </div>
                <div className="divide-y">
                  {procedures.map((procedure) => (
                    <div key={procedure.id} className="grid grid-cols-6 p-3 items-center">
                      <div>{procedure.date}</div>
                      <div>{procedure.name}</div>
                      <div>{procedure.professional}</div>
                      <div>R$ {procedure.price.toFixed(2).replace('.', ',')}</div>
                      <div>
                        <Badge 
                          variant={procedure.status === 'Concluído' ? 'default' : 
                                  procedure.status === 'Em andamento' ? 'secondary' : 
                                  'outline'}
                        >
                          {procedure.status}
                        </Badge>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Novo Pagamento
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 bg-muted/50 p-3 font-medium">
                  <div>Data</div>
                  <div>Valor</div>
                  <div>Método</div>
                  <div>Status</div>
                  <div>Comprovante</div>
                  <div className="text-right">Ações</div>
                </div>
                <div className="divide-y">
                  {payments.map((payment) => (
                    <div key={payment.id} className="grid grid-cols-6 p-3 items-center">
                      <div>{payment.date}</div>
                      <div>R$ {payment.amount.toFixed(2).replace('.', ',')}</div>
                      <div>{payment.method}</div>
                      <div>
                        <Badge 
                          variant={payment.status === 'Confirmado' ? 'default' : 'outline'}
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      <div>
                        {payment.receipt ? (
                          <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
                            <a href={payment.receipt} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" /> Ver
                            </a>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">Não disponível</span>
                        )}
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interactions Tab */}
        <TabsContent value="interactions" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Nova Interação
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Interações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted/50 p-3 font-medium">
                  <div>Data</div>
                  <div>Tipo</div>
                  <div>Profissional</div>
                  <div>Resumo</div>
                  <div className="text-right">Ações</div>
                </div>
                <div className="divide-y">
                  {interactions.map((interaction) => (
                    <div key={interaction.id} className="grid grid-cols-5 p-3 items-center">
                      <div>{interaction.date}</div>
                      <div>
                        <Badge variant="outline">{interaction.type}</Badge>
                      </div>
                      <div>{interaction.professional}</div>
                      <div className="truncate">{interaction.summary}</div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm">Editar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
