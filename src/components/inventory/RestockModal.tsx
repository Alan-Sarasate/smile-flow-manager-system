
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { updateInventoryQuantity } from '@/services/inventoryService';
import { InventoryItem } from '@/types/supabase';

interface RestockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onSuccess: () => void;
}

const RestockModal: React.FC<RestockModalProps> = ({ open, onOpenChange, item, onSuccess }) => {
  const [quantity, setQuantity] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;
    
    const newQuantity = parseInt(quantity, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) {
      toast.error('Por favor, insira uma quantidade válida');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await updateInventoryQuantity(item.id, newQuantity);
      
      if (result) {
        toast.success('Estoque atualizado com sucesso!');
        setQuantity('');
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error('Erro ao atualizar estoque');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      toast.error('Erro ao atualizar estoque');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Repor Estoque</DialogTitle>
            <DialogDescription>
              Atualize a quantidade do item {item?.name} no estoque.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currentQuantity" className="text-right">
                Atual
              </Label>
              <Input
                id="currentQuantity"
                value={item?.quantity || ''}
                className="col-span-3"
                readOnly
                disabled
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newQuantity" className="text-right">
                Nova
              </Label>
              <Input
                id="newQuantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                placeholder="Insira a nova quantidade"
                required
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestockModal;
