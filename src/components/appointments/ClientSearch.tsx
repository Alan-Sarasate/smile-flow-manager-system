
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchClients } from "@/services/clientService";
import { Client } from "@/types/supabase";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CreateClientForm } from './CreateClientForm';

interface ClientSearchProps {
  value?: string;
  onChange: (value: string, clientName?: string) => void;
}

export function ClientSearch({ value, onChange }: ClientSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClientSheetOpen, setNewClientSheetOpen] = useState(false);
  
  // Buscar clientes quando o termo de pesquisa mudar
  useEffect(() => {
    const fetchClients = async () => {
      if (search.length < 2) {
        setClients([]);
        return;
      }
      
      setLoading(true);
      try {
        const results = await searchClients(search);
        setClients(results);
      } catch (error) {
        console.error("Error searching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    
    const timeoutId = setTimeout(fetchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);
  
  // Se tiver um valor inicial, buscar o cliente
  useEffect(() => {
    const fetchClient = async () => {
      if (!value) {
        setSelectedClient(null);
        return;
      }
      
      if (selectedClient?.id === value) return; // Já selecionado
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', value)
          .single();
          
        if (data && !error) {
          setSelectedClient(data);
        }
      } catch (error) {
        console.error("Error fetching client:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClient();
  }, [value]);
  
  const handleClientCreated = (newClient: Client) => {
    setSelectedClient(newClient);
    onChange(newClient.id, newClient.name);
    setNewClientSheetOpen(false);
    setOpen(false);
  };
  
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedClient ? selectedClient.name : "Selecione um paciente"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
              placeholder="Buscar paciente..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty className="py-6 text-center text-sm">
              {loading ? (
                "Buscando pacientes..."
              ) : (
                <div>
                  <p>Nenhum paciente encontrado.</p>
                  <Sheet open={newClientSheetOpen} onOpenChange={setNewClientSheetOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setNewClientSheetOpen(true)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Cadastrar Novo Paciente
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <CreateClientForm onSuccess={handleClientCreated} />
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={client.id}
                  onSelect={() => {
                    setSelectedClient(client);
                    onChange(client.id, client.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === client.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{client.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {client.email} {client.phone ? ` • ${client.phone}` : ''}
                    </span>
                  </div>
                </CommandItem>
              ))}
              {clients.length > 0 && (
                <div className="border-t pt-2 pb-1 px-2">
                  <Sheet open={newClientSheetOpen} onOpenChange={setNewClientSheetOpen}>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setNewClientSheetOpen(true)}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Cadastrar Novo Paciente
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <CreateClientForm onSuccess={handleClientCreated} />
                    </SheetContent>
                  </Sheet>
                </div>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Importação necessária para a função interna
import { supabase } from '@/integrations/supabase/client';
