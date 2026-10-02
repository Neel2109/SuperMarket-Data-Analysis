import { SaleRecord } from '../types';

// Deterministic Pseudo-Random Number Generator so every load has consistent, high-quality data
let seed = 42;
function random() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

const BRANCHES: Array<{ branch: 'A' | 'B' | 'C'; city: 'Yangon' | 'Naypyitaw' | 'Mandalay' }> = [
  { branch: 'A', city: 'Yangon' },
  { branch: 'B', city: 'Mandalay' },
  { branch: 'C', city: 'Naypyitaw' },
];

const PRODUCT_LINES = [
  'Electronic accessories',
  'Fashion accessories',
  'Food and beverages',
  'Health and beauty',
  'Home and lifestyle',
  'Sports and travel',
] as const;

const PAYMENTS = ['Cash', 'Credit card', 'Ewallet'] as const;
const CUSTOMER_TYPES = ['Member', 'Normal'] as const;
const GENDERS = ['Female', 'Male'] as const;

export function generateInitialSupermarketData(): SaleRecord[] {
  seed = 12345;
  const records: SaleRecord[] = [];
  const startDate = new Date(2025, 0, 1); // Jan 1, 2025
  const totalDays = 90; // Q1 data (Jan - Mar)

  for (let i = 1; i <= 1000; i++) {
    const branchObj = BRANCHES[Math.floor(random() * BRANCHES.length)];
    const productLine = PRODUCT_LINES[Math.floor(random() * PRODUCT_LINES.length)];
    const customerType = CUSTOMER_TYPES[Math.floor(random() * CUSTOMER_TYPES.length)];
    const gender = GENDERS[Math.floor(random() * GENDERS.length)];
    const payment = PAYMENTS[Math.floor(random() * PAYMENTS.length)];

    // Realistic unit price: $10 to $99
    const unitPrice = parseFloat((10 + random() * 89).toFixed(2));
    const quantity = Math.floor(random() * 10) + 1; // 1 to 10
    const cogs = parseFloat((unitPrice * quantity).toFixed(2));
    const tax5Percent = parseFloat((cogs * 0.05).toFixed(4));
    const total = parseFloat((cogs + tax5Percent).toFixed(4));
    const grossIncome = tax5Percent;
    const grossMarginPercentage = 4.7619; // Standard 5% tax / 1.05 markup

    // Date generation across 3 months
    const dayOffset = Math.floor(random() * totalDays);
    const dateObj = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    // Hour distribution weighted around peak afternoon/evening (10:00 - 20:59)
    const hour = Math.floor(10 + random() * 11);
    const minute = Math.floor(random() * 60);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // Rating between 4.0 and 10.0
    const rating = parseFloat((4.0 + random() * 6.0).toFixed(1));

    // Formatted invoice ID: INV-xxx-xxxx
    const invoiceId = `INV-${branchObj.branch}${dateStr.replace(/-/g, '').slice(2, 6)}-${(1000 + i).toString()}`;

    records.push({
      invoiceId,
      branch: branchObj.branch,
      city: branchObj.city,
      customerType,
      gender,
      productLine,
      unitPrice,
      quantity,
      tax5Percent,
      total,
      date: dateStr,
      time: timeStr,
      payment,
      cogs,
      grossMarginPercentage,
      grossIncome,
      rating,
    });
  }

  return records;
}

export function convertToCSV(records: SaleRecord[]): string {
  const headers = [
    'Invoice ID',
    'Branch',
    'City',
    'Customer type',
    'Gender',
    'Product line',
    'Unit price',
    'Quantity',
    'Tax 5%',
    'Total',
    'Date',
    'Time',
    'Payment',
    'cogs',
    'gross margin percentage',
    'gross income',
    'Rating',
  ];

  const rows = records.map((r) => [
    `"${r.invoiceId}"`,
    `"${r.branch}"`,
    `"${r.city}"`,
    `"${r.customerType}"`,
    `"${r.gender}"`,
    `"${r.productLine}"`,
    r.unitPrice.toFixed(2),
    r.quantity,
    r.tax5Percent.toFixed(4),
    r.total.toFixed(4),
    `"${r.date}"`,
    `"${r.time}"`,
    `"${r.payment}"`,
    r.cogs.toFixed(2),
    r.grossMarginPercentage.toFixed(4),
    r.grossIncome.toFixed(4),
    r.rating.toFixed(1),
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
