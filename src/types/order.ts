export interface Order {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  karat: string;
  price: number;
  shipDate?: string;
  status: string;
  productionStepBalance?: number;
  expectedCompletion?: string;
  validated?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  latePunches: number;
  attendancePercent: number;
  commission: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
