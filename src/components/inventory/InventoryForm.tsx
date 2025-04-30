
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";

interface InventoryFormProps {
  defaultValues?: {
    id?: number;
    name?: string;
    category?: string;
    quantity?: number;
    minQuantity?: number;
    price?: number;
    expiryDate?: string;
  };
}

const categories = [
  "Resinas", 
  "Anestésicos", 
  "Materiais de Impressão", 
  "Instrumentos", 
  "Equipamentos", 
  "Restauradores",
  "Cirúrgicos",
  "Ortodontia", 
  "Descartáveis",
  "Diversos"
];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  category: z.string({
    required_error: "Por favor selecione uma categoria.",
  }),
  quantity: z.coerce.number().min(0, {
    message: "A quantidade não pode ser negativa.",
  }),
  minQuantity: z.coerce.number().min(0, {
    message: "A quantidade mínima não pode ser negativa.",
  }),
  price: z.coerce.number().min(0, {
    message: "O preço não pode ser negativo.",
  }),
  expiryDate: z.string().optional(),
});

const InventoryForm: React.FC<InventoryFormProps> = ({ defaultValues }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      category: defaultValues?.category || "",
      quantity: defaultValues?.quantity || 0,
      minQuantity: defaultValues?.minQuantity || 0,
      price: defaultValues?.price || 0,
      expiryDate: defaultValues?.expiryDate || "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success(defaultValues?.id ? "Item atualizado com sucesso!" : "Item adicionado com sucesso!", {
      description: values.name,
    });
    console.log(values);
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{defaultValues?.id ? "Editar Item" : "Novo Item"}</DialogTitle>
        <DialogDescription>
          {defaultValues?.id 
            ? "Edite as informações do item no estoque."
            : "Adicione um novo item ao estoque da clínica."}
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Item</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do item" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Validade (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="dd/mm/aaaa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade Mínima</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Unitário (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              {defaultValues?.id ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default InventoryForm;
