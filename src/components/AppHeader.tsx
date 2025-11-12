import { Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const AppHeader = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link to="/">
              <Button variant="ghost" size="sm">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-xl font-semibold text-primary">Emerald India</div>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">Demo mode</Badge>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              AD
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline">Admin Demo</span>
        </div>
      </div>
    </header>
  );
};
