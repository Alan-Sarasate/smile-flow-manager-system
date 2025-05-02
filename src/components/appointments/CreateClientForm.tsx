
import React from 'react';
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
import { createClient } from "@/services/clientService";
import { Client } from "@/types/supabase";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
  address: z.string().optional().or(z.literal('')),
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
      address: "",
      notes: ""
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  async function onSubmit(values: ClientFormValues) {
    setIsSubmitting(true);
    try {
      const result = await createClient({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        address: values.address || null
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                    <Input placeholder="(00) 0000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço completo (opcional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
