import { Mail, MessageSquare, Users, LayoutDashboard } from 'lucide-react';
import { AgentCard } from '@/components/AgentCard';
import { AppHeader } from '@/components/AppHeader';

const Dashboard = () => {
  const agents = [
    {
      title: 'Order Processing',
      description: 'Auto-read emails/PDFs/Excels, extract orders, and standardize data.',
      icon: Mail,
      route: '/order-processing',
    },
    {
      title: 'Order Status',
      description: 'Conversational chatbot for live order status based on production data.',
      icon: MessageSquare,
      route: '/order-status',
    },
    {
      title: 'HR Insights',
      description: 'Query attendance, late punch-ins, and commissions in natural language.',
      icon: Users,
      route: '/hr-insights',
    },
    {
      title: 'Operational Transparency',
      description: 'Cross-department view with KPIs, timeline, and activity feed.',
      icon: LayoutDashboard,
      route: '/operations',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Emerald India — Agent Suite</h1>
            <p className="text-muted-foreground text-lg">
              Intelligent automation for jewelry manufacturing workflows
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {agents.map((agent) => (
              <AgentCard key={agent.title} {...agent} />
            ))}
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Demo data is synthetic and tailored to typical jewelry manufacturing workflows.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
