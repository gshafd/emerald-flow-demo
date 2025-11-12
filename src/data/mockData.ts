import { Order, Employee } from '@/types/order';

export const MOCK_ORDERS: Order[] = [
  {
    id: 'EJ-0001',
    itemCode: 'GR-18K-001',
    description: 'Gold Ring',
    quantity: 1,
    karat: '18K',
    price: 1000,
    shipDate: '2025-11-15',
    status: 'Received',
    validated: false,
  },
  {
    id: 'EJ-0002',
    itemCode: 'GN-22K-045',
    description: 'Gold Necklace',
    quantity: 2,
    karat: '22K',
    price: 2500,
    shipDate: '2025-11-20',
    status: 'In Production',
    validated: false,
  },
  {
    id: 'PROD0001',
    itemCode: 'SP-SLV-220',
    description: 'Silver Pendant',
    quantity: 20,
    karat: 'Silver',
    price: 20,
    status: 'Final Polish',
    productionStepBalance: 4,
    expectedCompletion: '6 Hrs',
    validated: false,
  },
  {
    id: 'SO-00366',
    itemCode: 'GE-22K-189',
    description: 'Gold Earrings',
    quantity: 1,
    karat: '22K',
    price: 1500,
    status: 'Final QC',
    productionStepBalance: 2,
    validated: false,
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP001',
    name: 'Rahul Shah',
    latePunches: 3,
    attendancePercent: 92,
    commission: 450,
  },
  {
    id: 'EMP002',
    name: 'Meena Patel',
    latePunches: 1,
    attendancePercent: 98,
    commission: 120,
  },
  {
    id: 'EMP003',
    name: 'Arjun Kumar',
    latePunches: 4,
    attendancePercent: 88,
    commission: 700,
  },
  {
    id: 'EMP004',
    name: 'Priya Singh',
    latePunches: 0,
    attendancePercent: 100,
    commission: 60,
  },
  {
    id: 'EMP005',
    name: 'Suresh Rao',
    latePunches: 2,
    attendancePercent: 95,
    commission: 310,
  },
  {
    id: 'EMP006',
    name: 'Kavita Nair',
    latePunches: 1,
    attendancePercent: 97,
    commission: 200,
  },
];

export const CHAT_RESPONSES: Record<string, string> = {
  'EJ-0001': 'Order EJ-0001 — Gold Ring. Current stage: Final Polish. Production step balance: 4. Expected completion: 6 Hrs. Last updated: 2025-11-12 14:00.',
  'PROD0001': 'Order PROD0001 — Silver Pendant. Current stage: Final Polish. Production step balance: 4. Expected completion: 6 Hrs. Quantity: 20 units.',
  'EJ-0002': 'Order EJ-0002 — Gold Necklace. Current stage: In Production. No — has not shipped. Estimated ship date: 2025-11-20.',
  'SO-00366': 'Order SO-00366 — Gold Earrings. Current stage: Final QC. Production step balance: 2. Status: Pending Final QC.',
};
