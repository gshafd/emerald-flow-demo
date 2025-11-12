import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface AgentCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: string;
  hasData?: boolean;
}

export const AgentCard = ({ title, description, icon: Icon, route, hasData = true }: AgentCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => navigate(route)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="p-2 rounded-lg bg-accent mb-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {hasData && (
            <Badge variant="secondary" className="text-xs">
              Sample data
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full group-hover:bg-primary-hover">
          Open Agent
        </Button>
      </CardContent>
    </Card>
  );
};
