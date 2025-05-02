import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createClient, fetchAddressByCep } from "@/services/clientService";
import { Client } from "@/types/supabase";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Loader2 } from 'lucide-react';

interface CreateClientFormProps {
  onSuccess: (client: Client) => void;
}

const clientFormSchema = z.object({
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor insira um e-mail válido.",
  }),
  phone: z.string().min(8, {
    message: "Por favor insira um telefone válido.",
  }).optional().or(z.literal('')),
  cpf: z.string().optional().or(z.literal('')),
  cep: z.string().optional().or(z.literal('')),
  street: z.string().optional().or(z.literal('')),
  number: z.string().optional().or(z.literal('')),
  complement: z.string().optional().or(z.literal('')),
  neighborhood: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export function CreateClientForm({ onSuccess }: CreateClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      notes: ""
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  
  // Função para formatar CEP
  const formatCep = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona hífen após os primeiros 5 dígitos
      .substring(0, 9); // Limita o tamanho a 9 caracteres (00000-000)
  };
  
  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 10) {
      // Formato (00) 0000-0000 para telefones fixos
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    } else {
      // Formato (00) 00000-0000 para celulares
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }
  };
  
  // Função para formatar CPF
  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os primeiros 3 dígitos
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os segundos 3 dígitos
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Adiciona hífen após os terceiros 3 dígitos
      .substring(0, 14); // Limita o tamanho a 14 caracteres (000.000.000-00)
  };
  
  const handleCepChange = async (cep: string) => {
    const formattedCep = formatCep(cep);
    form.setValue('cep', formattedCep);
    
    // Se o CEP está completo (00000-000), busca o endereço
    if (formattedCep.length === 9) {
      setCepLoading(true);
      const address = await fetchAddressByCep(formattedCep);
      setCepLoading(false);
      
      if (address.error) {
        toast.error(address.error);
      } else {
        form.setValue('street', address.street || '');
        form.setValue('neighborhood', address.neighborhood || '');
        form.setValue('city', address.city || '');
        form.setValue('state', address.state || '');
        
        // Foca no campo número após preencher o endereço
        setTimeout(() => {
          const numberInput = document.getElementById("number");
          if (numberInput) numberInput.focus();
        }, 100);
      }
    }
  };
  
  const handlePhoneChange = (value: string) => {
    const formattedPhone = formatPhone(value);
    form.setValue('phone', formattedPhone);
  };
  
  const handleCpfChange = (value: string) => {
    const formattedCpf = formatCpf(value);
    form.setValue('cpf', formattedCpf);
  };
  
  async function onSubmit(values: ClientFormValues) {
    setIsSubmitting(true);
    try {
      // Preparar o endereço completo
      let fullAddress = '';
      if (values.street) {
        fullAddress += values.street;
        if (values.number) fullAddress += `, ${values.number}`;
        if (values.complement) fullAddress += ` - ${values.complement}`;
        if (values.neighborhood) fullAddress += `, ${values.neighborhood}`;
        if (values.city) fullAddress += `, ${values.city}`;
        if (values.state) fullAddress += ` - ${values.state}`;
        if (values.cep) fullAddress += `, CEP: ${values.cep}`;
      }
      
      const result = await createClient({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        address: fullAddress || null,
        cep: values.cep || null,
        street: values.street || null,
        number: values.number || null,
        complement: values.complement || null,
        neighborhood: values.neighborhood || null,
        city: values.city || null,
        state: values.state || null,
        cpf: values.cpf || null,
        notes: values.notes || null
      });
      
      if (result.success && result.client) {
        toast.success("Cliente cadastrado com sucesso");
        onSuccess(result.client);
      } else {
        toast.error("Erro ao cadastrar cliente");
      }
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Erro ao cadastrar cliente");
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <>
      <SheetHeader>
        <SheetTitle>Cadastrar Novo Paciente</SheetTitle>
        <SheetDescription>
          Preencha os dados do paciente para cadastrá-lo no sistema.
        </SheetDescription>
      </SheetHeader>
      
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Dados Pessoais</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="exemplo@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000" 
                          value={field.value || ''}
                          onChange={(e) => {
                            handlePhoneChange(e.target.value);
                          }} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00" 
                        value={field.value || ''}
                        onChange={(e) => {
                          handleCpfChange(e.target.value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Endereço</h3>
                {cepLoading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Buscando CEP...
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="00000-000" 
                        value={field.value || ''}
                        onChange={(e) => {
                          handleCepChange(e.target.value);
                        }} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rua/Avenida</FormLabel>
                        <FormControl>
                          <Input placeholder="Rua/Avenida" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input id="number" placeholder="Nº" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apartamento, Bloco, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="UF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Observações</h3>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Observações (opcional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSubmitting || cepLoading}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
