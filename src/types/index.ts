export interface SaleRecord {
  invoiceId: string;
  branch: 'A' | 'B' | 'C';
  city: 'Yangon' | 'Naypyitaw' | 'Mandalay';
  customerType: 'Member' | 'Normal';
  gender: 'Female' | 'Male';
  productLine:
    | 'Electronic accessories'
    | 'Fashion accessories'
    | 'Food and beverages'
    | 'Health and beauty'
    | 'Home and lifestyle'
    | 'Sports and travel';
  unitPrice: number;
  quantity: number;
  tax5Percent: number;
  total: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  payment: 'Cash' | 'Credit card' | 'Ewallet';
  cogs: number;
  grossMarginPercentage: number;
  grossIncome: number;
  rating: number; // 1-10
}

export interface FilterState {
  dateRange: [string, string];
  branch: string; // 'All' | 'A' | 'B' | 'C'
  productLine: string; // 'All' | ...
  customerType: string; // 'All' | 'Member' | 'Normal'
  payment: string; // 'All' | 'Cash' | 'Credit card' | 'Ewallet'
  gender: string; // 'All' | 'Female' | 'Male'
  searchQuery: string;
}

export interface DAXMeasure {
  id: string;
  name: string;
  category: 'Key Metrics' | 'Time Intelligence' | 'Customer & Basket' | 'Ranking & Pareto' | 'Profitability';
  formula: string;
  description: string;
  powerBiVisual: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  sources?: { uri: string; title: string }[];
  modelUsed?: string;
}

export interface CollegeProjectInfo {
  studentName: string;
  rollNumber: string;
  university: string;
  course: string;
  academicYear: string;
  facultyGuide: string;
  projectTitle: string;
}
