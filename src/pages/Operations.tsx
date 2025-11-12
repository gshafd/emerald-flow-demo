import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MOCK_ORDERS } from '@/data/mockData';
import { TrendingUp, Package, CheckCircle } from 'lucide-react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

const columns = ['Received', 'In Production', 'Final Polish', 'Final QC', 'Shipped'];

interface OrderCard {
  id: string;
  description: string;
  column: string;
}

const SortableOrderCard = ({ order }: { order: OrderCard }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border rounded-lg p-3 mb-2 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="font-medium text-sm">{order.id}</div>
      <div className="text-xs text-muted-foreground">{order.description}</div>
    </div>
  );
};

const Operations = () => {
  const [orderCards, setOrderCards] = useState<OrderCard[]>([
    { id: 'EJ-0001', description: 'Gold Ring', column: 'Final Polish' },
    { id: 'EJ-0002', description: 'Gold Necklace', column: 'In Production' },
    { id: 'PROD0001', description: 'Silver Pendant', column: 'Final Polish' },
    { id: 'SO-00366', description: 'Gold Earrings', column: 'Final QC' },
  ]);

  const [activityFeed] = useState([
    { id: 1, text: 'EJ-0001 moved to Final Polish', time: '10 mins ago' },
    { id: 2, text: 'PROD0001 expected completion updated', time: '25 mins ago' },
    { id: 3, text: 'SO-00366 entered Final QC', time: '1 hour ago' },
    { id: 4, text: 'EJ-0002 production started', time: '2 hours ago' },
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeOrder = orderCards.find(o => o.id === active.id);
    const overColumn = over.id as string;

    if (activeOrder && columns.includes(overColumn)) {
      setOrderCards(
        orderCards.map(order =>
          order.id === active.id ? { ...order, column: overColumn } : order
        )
      );
      toast.success(`${active.id} moved to ${overColumn}`);
    }
  };

  const kpis = [
    {
      title: 'Open Orders',
      value: MOCK_ORDERS.length,
      icon: Package,
    },
    {
      title: 'In Production',
      value: orderCards.filter(o => o.column === 'In Production').length,
      icon: TrendingUp,
    },
    {
      title: 'In QC',
      value: orderCards.filter(o => o.column === 'Final QC').length,
      icon: CheckCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Operational Transparency</h1>
            <p className="text-muted-foreground">
              Cross-department view with KPIs, timeline, and activity feed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {kpis.map((kpi) => (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Order Flow — Kanban Board</CardTitle>
                </CardHeader>
                <CardContent>
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-5 gap-3">
                      {columns.map((column) => (
                        <div key={column} className="space-y-2">
                          <div className="font-medium text-sm text-muted-foreground pb-2 border-b">
                            {column}
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {orderCards.filter(o => o.column === column).length}
                            </Badge>
                          </div>
                          <SortableContext
                            items={orderCards.filter(o => o.column === column).map(o => o.id)}
                            strategy={verticalListSortingStrategy}
                            id={column}
                          >
                            <div className="min-h-[200px] p-2 rounded-lg bg-muted/30">
                              {orderCards
                                .filter(order => order.column === column)
                                .map(order => (
                                  <SortableOrderCard key={order.id} order={order} />
                                ))}
                            </div>
                          </SortableContext>
                        </div>
                      ))}
                    </div>
                  </DndContext>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Activity Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {activityFeed.map((activity) => (
                        <div
                          key={activity.id}
                          className="text-sm border-l-2 border-primary pl-3 py-1 hover:bg-muted/50 rounded-r cursor-pointer transition-colors"
                        >
                          <div className="font-medium">{activity.text}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Operations;
