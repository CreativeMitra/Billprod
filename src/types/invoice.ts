export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  primaryLight: string;
  accent?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Company details for invoice sender
export interface CompanyDetails {
  name: string;
  email: string;
  address: string;
}

// Payment details interfaces
export interface BankTransferDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface PaymentDetails {
  method: 'bank_transfer' | 'upi' | 'payment_link' | 'paypal_wise';
  // Bank Transfer
  bankTransfer?: BankTransferDetails;
  // UPI
  upiId?: string;
  // Payment Link
  paymentLink?: string;
  // PayPal/Wise
  paypalEmail?: string;
}

// Only 6 currencies as requested
export const CURRENCIES: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
];

// Color schemes: Blue (default), Black, Gray, Green, Purple, Teal, Orange, Navy
export const COLOR_SCHEMES: ColorScheme[] = [
  { id: 'blue', name: 'Blue', primary: '#2563EB', primaryLight: '#EFF6FF' },
  { id: 'black', name: 'Black', primary: '#18181B', primaryLight: '#F4F4F5' },
  { id: 'gray', name: 'Gray', primary: '#6B7280', primaryLight: '#F9FAFB' },
  { id: 'green', name: 'Green', primary: '#16A34A', primaryLight: '#F0FDF4' },
  { id: 'purple', name: 'Purple', primary: '#9333EA', primaryLight: '#FAF5FF' },
  { id: 'teal', name: 'Teal', primary: '#0D9488', primaryLight: '#F0FDFA' },
  { id: 'orange', name: 'Orange', primary: '#EA580C', primaryLight: '#FFF7ED' },
  { id: 'navy', name: 'Navy', primary: '#1E3A5F', primaryLight: '#EFF6FF' },
];

export interface Invoice {
  id: string;
  invoiceNumber: string;
  companyDetails: CompanyDetails;
  client: Client;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
  notes: string;
  currency: string;
  paymentDetails: PaymentDetails;
  template: TemplateType;
  templateVariant?: string;
  colorScheme?: string;
  // Legacy fields for backward compatibility
  paymentMethod?: string;
  paymentValue?: string;
  inputCurrency?: string;
  outputCurrency?: string;
  exchangeRate?: number;
}

export type TemplateType = 'minimalist' | 'modern';

export interface TemplateVariant {
  id: string;
  name: string;
  preview: string;
}

export const MODERN_VARIANTS: TemplateVariant[] = [
  { id: 'classic-modern', name: 'Classic Modern', preview: 'Clean professional layout' },
  { id: 'card-based', name: 'Card Based', preview: 'Card-based modern layout' },
  { id: 'clean-header', name: 'Clean Header', preview: 'Clean header highlight' },
  { id: 'ultra-minimal', name: 'Ultra Minimal', preview: 'Ultra minimal modern' },
  { id: 'minimal-clean', name: 'Minimal Clean', preview: 'Minimal clean layout' },
  { id: 'asymmetric', name: 'Asymmetric', preview: 'Modern asymmetric layout' },
  { id: 'floating-summary', name: 'Floating Summary', preview: 'Floating summary card' },
  { id: 'section-divider', name: 'Section Divider', preview: 'Section divider bars' },
  { id: 'editorial-luxury', name: 'Editorial Luxury', preview: 'Editorial luxury style' },
  { id: 'black-edge', name: 'Black Edge', preview: 'Black edge layout' },
  { id: 'gold-accent', name: 'Gold Accent', preview: 'Gold accent luxury' },
  { id: 'payment-focus', name: 'Payment Focus', preview: 'Smart payment focus' },
];
