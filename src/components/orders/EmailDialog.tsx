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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EmailDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

export const EmailDialog = ({ order, open, onClose }: EmailDialogProps) => {
  const [to, setTo] = useState('customer@example.com');
  const [subject, setSubject] = useState(`Order ${order.id} — Confirmation`);
  const [body, setBody] = useState(
    `Dear Customer,\n\nYour order ${order.id} for ${order.description} (${order.quantity} unit${order.quantity > 1 ? 's' : ''}) has been received and is currently in ${order.status} status.\n\nExpected completion: ${order.expectedCompletion || order.shipDate || 'TBD'}\n\nThank you for your business.\n\nBest regards,\nEmerald India`
  );

  const handleSend = () => {
    toast.success(`Email sent successfully to ${to}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Email Customer — Order {order.id}</DialogTitle>
          <DialogDescription>
            Send order confirmation to customer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>Send Email</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
