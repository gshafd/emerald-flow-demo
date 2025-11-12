import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types/order';
import { CHAT_RESPONSES, MOCK_ORDERS } from '@/data/mockData';
import { Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const OrderStatus = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I can help you check order status. Try asking about orders like EJ-0001, PROD0001, EJ-0002, or SO-00366.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [highlightedOrder, setHighlightedOrder] = useState<string | null>(null);

  const sampleQuestions = [
    'Where is order EJ-0001?',
    'Show status for PROD0001',
    'Which orders are pending QC?',
    'Has EJ-0002 shipped?',
  ];

  const handleSend = (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = 'I cannot find that order in demo data — try another ID.';
      let foundOrderId: string | null = null;

      for (const [orderId, orderResponse] of Object.entries(CHAT_RESPONSES)) {
        if (messageText.toUpperCase().includes(orderId)) {
          response = orderResponse;
          foundOrderId = orderId;
          break;
        }
      }

      if (messageText.toLowerCase().includes('pending qc') || messageText.toLowerCase().includes('pending final qc')) {
        response = 'Order SO-00366 — Gold Earrings is currently pending Final QC with production step balance of 2.';
        foundOrderId = 'SO-00366';
      }

      if (messageText.toLowerCase().includes('shipped') && messageText.toUpperCase().includes('EJ-0002')) {
        response = 'No — Order EJ-0002 has not shipped. It is currently in production. Estimated ship date: 2025-11-20.';
        foundOrderId = 'EJ-0002';
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      setHighlightedOrder(foundOrderId);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const highlightedOrderData = highlightedOrder 
    ? MOCK_ORDERS.find(o => o.id === highlightedOrder)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Conversational Order Status Chatbot</h1>
            <p className="text-muted-foreground">
              Ask about any order and get live status based on production data
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Chat Assistant</CardTitle>
                  <CardDescription>Ask natural language questions about orders</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 pr-4 mb-4">
                    <div className="space-y-4">
                      {messages.map((message, idx) => (
                        <div
                          key={idx}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <div className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {sampleQuestions.map((q) => (
                        <Button
                          key={q}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(q)}
                          disabled={isTyping}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about an order..."
                        disabled={isTyping}
                      />
                      <Button onClick={() => handleSend()} disabled={isTyping || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Details from latest query</CardDescription>
                </CardHeader>
                <CardContent>
                  {highlightedOrderData ? (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Order ID</div>
                        <div className="font-semibold">{highlightedOrderData.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Description</div>
                        <div className="font-medium">{highlightedOrderData.description}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <Badge>{highlightedOrderData.status}</Badge>
                      </div>
                      {highlightedOrderData.expectedCompletion && (
                        <div>
                          <div className="text-sm text-muted-foreground">Expected Completion</div>
                          <div className="font-medium">{highlightedOrderData.expectedCompletion}</div>
                        </div>
                      )}
                      {highlightedOrderData.shipDate && (
                        <div>
                          <div className="text-sm text-muted-foreground">Ship Date</div>
                          <div className="font-medium">{highlightedOrderData.shipDate}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">Quantity</div>
                        <div className="font-medium">{highlightedOrderData.quantity}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Karat</div>
                        <div className="font-medium">{highlightedOrderData.karat}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      Ask about an order to see details here
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderStatus;
