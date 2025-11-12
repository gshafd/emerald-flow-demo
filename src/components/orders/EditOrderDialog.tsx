import { useState } from 'react';
import { Order } from '@/types/order';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EditOrderDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Order>) => void;
}

export const EditOrderDialog = ({ order, open, onClose, onSave }: EditOrderDialogProps) => {
  const [quantity, setQuantity] = useState(order.quantity);
  const [karat, setKarat] = useState(order.karat);
  const [status, setStatus] = useState(order.status);
  const [expectedCompletion, setExpectedCompletion] = useState(order.expectedCompletion || '');

  const handleSave = () => {
    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    onSave({
      quantity,
      karat,
      status,
      expectedCompletion,
    });
    toast.success(`Order ${order.id} updated successfully`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Order {order.id}</DialogTitle>
          <DialogDescription>
            Update order details and production status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="karat">Karat</Label>
            <Input
              id="karat"
              value={karat}
              onChange={(e) => setKarat(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected">Expected Completion</Label>
            <Input
              id="expected"
              value={expectedCompletion}
              onChange={(e) => setExpectedCompletion(e.target.value)}
              placeholder="e.g., 6 Hrs, 2025-11-15"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
