import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Employee } from '@/types/order';
import { MOCK_EMPLOYEES } from '@/data/mockData';
import { Search, Download, User } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HRInsights = () => {
  const [query, setQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [viewType, setViewType] = useState<'attendance' | 'commission'>('attendance');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const sampleQueries = [
    'Show late punch-ins this week',
    'Who has >3 late punches?',
    'Attendance summary — last 30 days',
    'Top 5 salespeople by commission',
  ];

  const handleQuery = (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setShowResults(true);
    
    if (q.toLowerCase().includes('commission') || q.toLowerCase().includes('sales')) {
      setViewType('commission');
      const sorted = [...MOCK_EMPLOYEES].sort((a, b) => b.commission - a.commission);
      setEmployees(sorted.slice(0, 5));
      toast.success('Commission data loaded');
    } else if (q.toLowerCase().includes('>3') || q.toLowerCase().includes('3 late')) {
      setViewType('attendance');
      const filtered = MOCK_EMPLOYEES.filter(e => e.latePunches >= 3);
      setEmployees(filtered);
      toast.success(`Found ${filtered.length} employees with 3+ late punches`);
    } else {
      setViewType('attendance');
      setEmployees(MOCK_EMPLOYEES);
      toast.success('Attendance data loaded');
    }
  };

  const handleExportCSV = () => {
    toast.success('CSV file downloaded');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  const chartData = employees.map(e => ({
    name: e.name.split(' ')[0],
    latePunches: e.latePunches,
  }));

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">HR Insights Assistant</h1>
            <p className="text-muted-foreground">
              Query attendance, late punch-ins, and commissions in natural language
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Query Panel</CardTitle>
              <CardDescription>
                Ask about attendance, late punches, or commission data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask something like 'Show late punch-ins this week'..."
                />
                <Button onClick={() => handleQuery()}>
                  <Search className="h-4 w-4 mr-2" />
                  Query
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuery(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {showResults && (
            <>
              {viewType === 'attendance' && employees.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Late Punch-ins This Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="latePunches" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {viewType === 'attendance' ? 'Attendance Summary' : 'Commission Summary'}
                      </CardTitle>
                      <CardDescription>
                        {employees.length} employee{employees.length !== 1 ? 's' : ''} found
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Name</TableHead>
                          {viewType === 'attendance' && (
                            <>
                              <TableHead>Late Punches</TableHead>
                              <TableHead>Attendance %</TableHead>
                            </>
                          )}
                          <TableHead>Commission</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employees.map((emp) => (
                          <TableRow 
                            key={emp.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedEmployee(emp)}
                          >
                            <TableCell className="font-medium">{emp.id}</TableCell>
                            <TableCell>{emp.name}</TableCell>
                            {viewType === 'attendance' && (
                              <>
                                <TableCell>
                                  <span className={emp.latePunches >= 3 ? 'text-destructive font-semibold' : ''}>
                                    {emp.latePunches}
                                  </span>
                                </TableCell>
                                <TableCell>{emp.attendancePercent}%</TableCell>
                              </>
                            )}
                            <TableCell>${emp.commission}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedEmployee(emp);
                                }}
                              >
                                <User className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Sheet open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <SheetContent>
          {selectedEmployee && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedEmployee.name}</SheetTitle>
                <SheetDescription>Employee ID: {selectedEmployee.id}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Late Punches (This Week)</div>
                  <div className="text-2xl font-bold">{selectedEmployee.latePunches}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Attendance</div>
                  <div className="text-2xl font-bold">{selectedEmployee.attendancePercent}%</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Commission</div>
                  <div className="text-2xl font-bold">${selectedEmployee.commission}</div>
                </div>

                <div className="pt-4">
                  <div className="text-sm font-medium mb-2">Recent Punch-in History</div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>Mon 09:05 — Late by 5 min</div>
                    <div>Tue 08:58 — On time</div>
                    <div>Wed 09:12 — Late by 12 min</div>
                    <div>Thu 08:55 — On time</div>
                    <div>Fri 09:08 — Late by 8 min</div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  onClick={() => {
                    toast.success('Gentle reminder sent to ' + selectedEmployee.name);
                    setSelectedEmployee(null);
                  }}
                >
                  Send Gentle Reminder
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HRInsights;
