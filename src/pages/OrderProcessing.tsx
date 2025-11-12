import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { OrderTable } from '@/components/orders/OrderTable';
import { Order } from '@/types/order';
import { MOCK_ORDERS } from '@/data/mockData';
import { Inbox, Upload, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const OrderProcessing = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    setProgress(0);
    setShowResults(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 1000);

    setTimeout(() => {
      setIsScanning(false);
      setOrders(MOCK_ORDERS);
      setShowResults(true);
      toast.success('Inbox scan complete — 4 orders extracted');
    }, 4000);
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.xlsx,.xls';
    input.onchange = () => {
      setTimeout(() => {
        const newOrder: Order = {
          id: 'UPLOAD-001',
          itemCode: 'GN-24K-099',
          description: 'Gold Necklace Set',
          quantity: 1,
          karat: '24K',
          price: 3500,
          status: 'Received',
          validated: false,
        };
        setOrders([...orders, newOrder]);
        toast.success('File uploaded — 1 order extracted');
      }, 1500);
    };
    input.click();
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Intelligent Email Order Extraction</h1>
            <p className="text-muted-foreground">
              Auto-read emails/PDFs/Excels, extract orders, and standardize data
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Extract orders from email or files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  <Inbox className="mr-2 h-4 w-4" />
                  Scan Inbox
                </Button>

                {isScanning && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      Scanning sales inbox...
                    </div>
                    <Progress value={progress} />
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleUpload}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Sample File
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              {showResults && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Extracted Orders</CardTitle>
                      <CardDescription>
                        {orders.length} order{orders.length !== 1 ? 's' : ''} found and standardized
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <OrderTable orders={orders} onUpdateOrder={updateOrder} />
                    </CardContent>
                  </Card>

                  <Collapsible open={showRawText} onOpenChange={setShowRawText}>
                    <Card>
                      <CardHeader>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between p-0 hover:bg-transparent">
                            <CardTitle>Raw Extracted Text (Sample)</CardTitle>
                            {showRawText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </CollapsibleTrigger>
                        <CardDescription>
                          View original text from extraction source
                        </CardDescription>
                      </CardHeader>
                      <CollapsibleContent>
                        <CardContent>
                          <div className="bg-muted p-4 rounded-md text-sm font-mono">
                            <div className="space-y-2 text-muted-foreground">
                              <div>Sales Order: EJ-0001</div>
                              <div>Item: Gold Ring, 18K configuration</div>
                              <div>Quantity: 1 unit</div>
                              <div>Price: USD 1,000.00</div>
                              <div>Ship to: Main warehouse</div>
                              <div>Expected ship date: 2025-11-15</div>
                              <div>Sales subtotal: 1,000.00 USD</div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderProcessing;
