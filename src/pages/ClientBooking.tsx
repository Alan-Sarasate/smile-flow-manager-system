
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BookingForm from '@/components/client/BookingForm';
import { Clock, Calendar, User } from 'lucide-react';

const ClientBooking = () => {
  return (
    <div className="min-h-screen bg-dental-gray/30 py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-dental-blue">
            Agendamento Online
          </h1>
          <p className="text-muted-foreground mt-2">
            Marque sua consulta de forma rápida e prática.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader className="pb-3 text-center">
              <div className="w-12 h-12 rounded-full bg-dental-blue/10 flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-dental-blue" />
              </div>
              <CardTitle className="text-lg">Escolha o Horário</CardTitle>
              <CardDescription>Selecione o melhor horário para sua consulta</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-3 text-center">
              <div className="w-12 h-12 rounded-full bg-dental-blue/10 flex items-center justify-center mx-auto mb-2">
                <Calendar className="h-6 w-6 text-dental-blue" />
              </div>
              <CardTitle className="text-lg">Selecione o Serviço</CardTitle>
              <CardDescription>Escolha o procedimento que você precisa</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader className="pb-3 text-center">
              <div className="w-12 h-12 rounded-full bg-dental-blue/10 flex items-center justify-center mx-auto mb-2">
                <User className="h-6 w-6 text-dental-blue" />
              </div>
              <CardTitle className="text-lg">Confirme seus Dados</CardTitle>
              <CardDescription>Preencha seus dados de contato e confirme</CardDescription>
            </CardHeader>
          </Card>
        </div>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Agende sua Consulta</CardTitle>
            <CardDescription>
              Preencha o formulário abaixo para agendar seu horário em nossa clínica odontológica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookingForm />
          </CardContent>
        </Card>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-4">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-dental-blue">Como cancelar ou reagendar minha consulta?</h3>
              <p className="text-muted-foreground">
                Entre em contato conosco por telefone com pelo menos 24 horas de antecedência.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-dental-blue">Preciso levar algum documento?</h3>
              <p className="text-muted-foreground">
                Sim, traga seu documento de identidade e cartão do convênio odontológico (se tiver).
              </p>
            </div>
            <div>
              <h3 className="font-medium text-dental-blue">Quanto tempo antes devo chegar?</h3>
              <p className="text-muted-foreground">
                Recomendamos chegar 15 minutos antes do seu horário agendado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
