import { useState } from 'react';
import { Order } from '@/types/order';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Check, Send, Mail } from 'lucide-react';
import { EditOrderDialog } from './EditOrderDialog';
import { EmailDialog } from './EmailDialog';
import { toast } from 'sonner';

interface OrderTableProps {
  orders: Order[];
  onUpdateOrder: (orderId: string, updates: Partial<Order>) => void;
}

export const OrderTable = ({ orders, onUpdateOrder }: OrderTableProps) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [emailOrder, setEmailOrder] = useState<Order | null>(null);

  const handleValidate = (order: Order) => {
    onUpdateOrder(order.id, { validated: true });
    toast.success(`Order ${order.id} marked as validated`);
  };

  const handleSendToProcessing = (order: Order) => {
    toast.success(`Order ${order.id} sent to Production queue`);
  };

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Item Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Karat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="text-muted-foreground">{order.itemCode}</TableCell>
                <TableCell>{order.description}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.karat}</TableCell>
                <TableCell>
                  <Badge variant={order.validated ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {order.expectedCompletion || order.shipDate || '—'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingOrder(order)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    {!order.validated && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleValidate(order)}
                      >
                        <Check className="h-3.5 w-3.5 text-success" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendToProcessing(order)}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEmailOrder(order)}
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingOrder && (
        <EditOrderDialog
          order={editingOrder}
          open={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={(updates) => {
            onUpdateOrder(editingOrder.id, updates);
            setEditingOrder(null);
          }}
        />
      )}

      {emailOrder && (
        <EmailDialog
          order={emailOrder}
          open={!!emailOrder}
          onClose={() => setEmailOrder(null)}
        />
      )}
    </>
  );
};
