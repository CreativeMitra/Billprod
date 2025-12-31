import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Plus, Trash2, Building2, CreditCard, Link2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Client, Invoice, InvoiceItem, TemplateType, MODERN_VARIANTS, COLOR_SCHEMES, CURRENCIES, CompanyDetails, PaymentDetails } from "@/types/invoice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  onSave: (invoice: Invoice) => void;
  invoiceNumber: string;
  duplicateFrom?: Invoice | null;
}

// Templates that have special color schemes and shouldn't show color picker
const TEMPLATES_WITH_FIXED_COLORS = ['gold-accent', 'black-edge'];

const CreateInvoice = ({ isOpen, onClose, clients, onSave, invoiceNumber: defaultInvoiceNumber, duplicateFrom }: CreateInvoiceProps) => {
  // Invoice number - now customizable
  const [invoiceNumber, setInvoiceNumber] = useState(duplicateFrom?.invoiceNumber || defaultInvoiceNumber);
  
  // Company Details
  const [companyName, setCompanyName] = useState(duplicateFrom?.companyDetails?.name || "");
  const [companyEmail, setCompanyEmail] = useState(duplicateFrom?.companyDetails?.email || "");
  const [companyAddress, setCompanyAddress] = useState(duplicateFrom?.companyDetails?.address || "");

  const [selectedClientId, setSelectedClientId] = useState<string>(duplicateFrom?.client.id || "");
  const [items, setItems] = useState<InvoiceItem[]>(
    duplicateFrom?.items || [{ id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }]
  );
  const [enableGST, setEnableGST] = useState(duplicateFrom ? duplicateFrom.tax > 0 : false);
  const [gstRate, setGstRate] = useState(18);
  const [discount, setDiscount] = useState(duplicateFrom?.discount || 0);
  const [notes, setNotes] = useState(duplicateFrom?.notes || "");
  const [dueDate, setDueDate] = useState(duplicateFrom?.dueDate || "");
  const [currency, setCurrency] = useState(duplicateFrom?.currency || "INR");
  const [template, setTemplate] = useState<TemplateType>(duplicateFrom?.template || "modern");
  const [templateVariant, setTemplateVariant] = useState(duplicateFrom?.templateVariant || "classic-modern");
  const [colorScheme, setColorScheme] = useState(duplicateFrom?.colorScheme || "blue");
  
  // Check if current variant has fixed colors
  const hasFixedColors = TEMPLATES_WITH_FIXED_COLORS.includes(templateVariant);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState<PaymentDetails['method']>(
    duplicateFrom?.paymentDetails?.method || "upi"
  );
  // Bank Transfer
  const [accountHolderName, setAccountHolderName] = useState(duplicateFrom?.paymentDetails?.bankTransfer?.accountHolderName || "");
  const [bankName, setBankName] = useState(duplicateFrom?.paymentDetails?.bankTransfer?.bankName || "");
  const [accountNumber, setAccountNumber] = useState(duplicateFrom?.paymentDetails?.bankTransfer?.accountNumber || "");
  const [ifscCode, setIfscCode] = useState(duplicateFrom?.paymentDetails?.bankTransfer?.ifscCode || "");
  // UPI
  const [upiId, setUpiId] = useState(duplicateFrom?.paymentDetails?.upiId || "");
  // Payment Link
  const [paymentLink, setPaymentLink] = useState(duplicateFrom?.paymentDetails?.paymentLink || "");
  // PayPal/Wise
  const [paypalEmail, setPaypalEmail] = useState(duplicateFrom?.paymentDetails?.paypalEmail || "");

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = enableGST ? (subtotal * gstRate) / 100 : 0;
  const total = subtotal + tax - discount;

  const currencySymbol = CURRENCIES.find(c => c.code === currency)?.symbol || '₹';

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 }]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Please enter your company name");
      return;
    }

    if (!companyEmail.trim()) {
      toast.error("Please enter your company email");
      return;
    }

    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }

    if (items.some(item => !item.description || item.price <= 0)) {
      toast.error("Please fill in all item details");
      return;
    }

    if (!dueDate) {
      toast.error("Please set a due date");
      return;
    }

    // Build payment details
    const paymentDetails: PaymentDetails = {
      method: paymentMethod,
    };

    if (paymentMethod === 'bank_transfer') {
      if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
        toast.error("Please fill in all bank transfer details");
        return;
      }
      paymentDetails.bankTransfer = {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
      };
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        toast.error("Please enter your UPI ID");
        return;
      }
      paymentDetails.upiId = upiId;
    } else if (paymentMethod === 'payment_link') {
      if (!paymentLink) {
        toast.error("Please enter your payment link");
        return;
      }
      paymentDetails.paymentLink = paymentLink;
    } else if (paymentMethod === 'paypal_wise') {
      if (!paypalEmail) {
        toast.error("Please enter your PayPal/Wise email");
        return;
      }
      paymentDetails.paypalEmail = paypalEmail;
    }

    const companyDetails: CompanyDetails = {
      name: companyName,
      email: companyEmail,
      address: companyAddress,
    };

    const publicId = uuidv4();
    const invoice: Invoice = {
      id: publicId,
      invoiceNumber,
      companyDetails,
      client: selectedClient,
      items,
      subtotal,
      tax,
      discount,
      total,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      dueDate,
      notes,
      currency,
      paymentDetails,
      template,
      templateVariant: template === 'modern' ? templateVariant : undefined,
      colorScheme,
    };

const { error } = await supabase.from("invoices").insert({
  public_id: publicId,
  invoice_data: invoice,
});

if (error) {
  toast.error("Failed to create invoice");
  return;
}

const shareLink = `${window.location.origin}/invoice/view/${publicId}`;
navigator.clipboard.writeText(shareLink);

    onSave(invoice);
    toast.success("Invoice created successfully");
    onClose();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Company Details Section */}
          <div className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-primary font-medium">
              <Building2 className="h-5 w-5" />
              <span>Your Company Details</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Company Email *</Label>
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="your@company.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company Address</Label>
              <Textarea
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Your company address..."
                rows={2}
              />
            </div>
          </div>

          {/* Invoice Number & Client */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Invoice Number</Label>
              <Input 
                value={invoiceNumber} 
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-001"
              />
            </div>
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date & Currency */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(curr => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <Label>Items</Label>
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="w-20">
                  <Input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="w-28">
                  <Input
                    type="number"
                    placeholder="Price"
                    min="0"
                    value={item.price || ''}
                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length === 1}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* GST Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div>
              <p className="font-medium">Enable GST</p>
              <p className="text-sm text-muted-foreground">Add {gstRate}% GST to invoice</p>
            </div>
            <div className="flex items-center gap-3">
              {enableGST && (
                <Input
                  type="number"
                  value={gstRate}
                  onChange={(e) => setGstRate(parseInt(e.target.value) || 0)}
                  className="w-20"
                  min="0"
                  max="100"
                />
              )}
              <Switch checked={enableGST} onCheckedChange={setEnableGST} />
            </div>
          </div>

          {/* Discount */}
          <div className="space-y-2">
            <Label>Discount ({currencySymbol})</Label>
            <Input
              type="number"
              value={discount || ''}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
            />
          </div>

          {/* Summary */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {enableGST && (
              <div className="flex justify-between text-sm">
                <span>GST ({gstRate}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-destructive">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary/20">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment Options Section */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Payment Options</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
                { id: 'upi', label: 'UPI ID', icon: Wallet },
                { id: 'payment_link', label: 'Payment Link', icon: Link2 },
                { id: 'paypal_wise', label: 'PayPal/Wise', icon: CreditCard },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPaymentMethod(id as PaymentDetails['method'])}
                  className={`p-3 rounded-lg border-2 text-center transition-all flex flex-col items-center gap-2 ${
                    paymentMethod === id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Bank Transfer Fields */}
            {paymentMethod === 'bank_transfer' && (
              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>Account Holder Name *</Label>
                  <Input
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="Account holder name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Name *</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number *</Label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>IFSC Code *</Label>
                  <Input
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="IFSC code"
                  />
                </div>
              </div>
            )}

            {/* UPI Field */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>UPI ID *</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                  />
                </div>
              </div>
            )}

            {/* Payment Link Field */}
            {paymentMethod === 'payment_link' && (
              <div className="p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>Payment Link *</Label>
                  <Input
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                    placeholder="https://razorpay.me/... or payment URL"
                  />
                  <p className="text-xs text-muted-foreground">A "PAY NOW" button will appear on your invoice</p>
                </div>
              </div>
            )}

            {/* PayPal/Wise Email Field */}
            {paymentMethod === 'paypal_wise' && (
              <div className="p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>PayPal/Wise Email *</Label>
                  <Input
                    type="email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes for the client..."
              rows={3}
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-4">
            <Label>Invoice Template</Label>
            <div className="grid grid-cols-2 gap-3">
              {(['minimalist', 'modern'] as TemplateType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTemplate(t)}
                  className={`p-4 rounded-lg border-2 text-center transition-all ${
                    template === t 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium capitalize">{t}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t === 'modern' ? '10 variants' : '1 variant'}
                  </div>
                </button>
              ))}
            </div>

            {template === 'modern' && (
              <div className="space-y-2">
                <Label>Modern Variant</Label>
                <Select value={templateVariant} onValueChange={setTemplateVariant}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODERN_VARIANTS.map(variant => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Scheme - only show for templates without fixed colors */}
            {!hasFixedColors && (
              <div className="space-y-2">
                <Label>Color Scheme</Label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SCHEMES.map(scheme => (
                    <button
                      key={scheme.id}
                      type="button"
                      onClick={() => setColorScheme(scheme.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all ${
                        colorScheme === scheme.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: scheme.primary }}
                      />
                      <span className="text-sm">{scheme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {hasFixedColors && (
              <p className="text-sm text-muted-foreground">
                This template has a fixed color scheme.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Create Invoice
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoice;
