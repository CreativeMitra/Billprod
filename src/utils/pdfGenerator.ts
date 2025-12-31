import { Invoice, COLOR_SCHEMES, PaymentDetails } from '@/types/invoice';

const formatCurrency = (amount: number, currencyCode: string = 'INR') => {
  const locale = currencyCode === 'INR' ? 'en-IN' : 
                 currencyCode === 'USD' ? 'en-US' :
                 currencyCode === 'EUR' ? 'de-DE' :
                 currencyCode === 'AUD' ? 'en-AU' :
                 currencyCode === 'CAD' ? 'en-CA' :
                 currencyCode === 'AED' ? 'ar-AE' : 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getColorScheme = (schemeId: string = 'blue') => {
  return COLOR_SCHEMES.find(s => s.id === schemeId) || COLOR_SCHEMES[0];
};

const getItemsHtml = (invoice: Invoice) => {
  const currency = invoice.currency || 'INR';
  
  return invoice.items.map(item => {
    const itemTotal = item.price * item.quantity;
    return `
    <tr>
      <td>${item.description} × ${item.quantity}</td>
      <td class="right">${formatCurrency(itemTotal, currency)}</td>
    </tr>
  `;
  }).join('');
};

const getSummaryAmounts = (invoice: Invoice) => {
  const currency = invoice.currency || 'INR';
  
  return {
    subtotal: formatCurrency(invoice.subtotal, currency),
    tax: formatCurrency(invoice.tax, currency),
    discount: formatCurrency(invoice.discount, currency),
    total: formatCurrency(invoice.total, currency),
  };
};

const getPaymentHtml = (invoice: Invoice, colors: { primary: string }) => {
  const payment = invoice.paymentDetails;
  
  // Handle legacy payment format
  if (!payment && invoice.paymentMethod) {
    return `
      <div class="payment-section">
        <div class="payment-title">Payment Method</div>
        <div class="payment-method">${invoice.paymentMethod}</div>
        <div class="payment-value">${invoice.paymentValue || ''}</div>
      </div>
    `;
  }
  
  if (!payment) return '';

  let paymentContent = '';
  
  switch (payment.method) {
    case 'bank_transfer':
      paymentContent = `
        <div class="payment-title">Bank Transfer</div>
        <div class="payment-details">
          <div class="payment-row"><span>Account Holder:</span><strong>${payment.bankTransfer?.accountHolderName || ''}</strong></div>
          <div class="payment-row"><span>Bank Name:</span><strong>${payment.bankTransfer?.bankName || ''}</strong></div>
          <div class="payment-row"><span>Account Number:</span><strong>${payment.bankTransfer?.accountNumber || ''}</strong></div>
          <div class="payment-row"><span>IFSC Code:</span><strong>${payment.bankTransfer?.ifscCode || ''}</strong></div>
        </div>
      `;
      break;
    case 'upi':
      paymentContent = `
        <div class="payment-title">UPI Payment</div>
        <div class="payment-details">
          <div class="payment-row"><span>UPI ID:</span><strong>${payment.upiId || ''}</strong></div>
        </div>
      `;
      break;
    case 'payment_link':
      paymentContent = `
        <div class="payment-title">Online Payment</div>
        <a href="${payment.paymentLink || '#'}" target="_blank" class="pay-now-btn" style="
          display: inline-block;
          background: ${colors.primary};
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          margin-top: 12px;
          text-align: center;
        ">PAY NOW</a>
      `;
      break;
    case 'paypal_wise':
      paymentContent = `
        <div class="payment-title">PayPal / Wise</div>
        <div class="payment-details">
          <div class="payment-row"><span>Email:</span><strong>${payment.paypalEmail || ''}</strong></div>
        </div>
      `;
      break;
  }

  return `<div class="payment-section">${paymentContent}</div>`;
};

const getCompanyHtml = (invoice: Invoice) => {
  const company = invoice.companyDetails;
  if (!company) {
    return `
      <strong>Your Business Name</strong>
      <div class="email">your@email.com</div>
      <div class="address">Your Address</div>
    `;
  }
  return `
    <strong>${company.name}</strong>
    <div class="email">${company.email}</div>
    <div class="address">${company.address || ''}</div>
  `;
};

// Template: Classic Modern (Top of list)
const getClassicModernTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => {
  const amounts = getSummaryAmounts(invoice);
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Invoice — ${invoice.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root {
    --primary: ${colors.primary};
    --primary-light: ${colors.primaryLight};
    --text: #1a1a2e;
    --muted: #64748B;
    --border: #e2e8f0;
    --bg: #ffffff;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif; color: var(--text); background: var(--bg); padding: 40px; }
  .invoice { max-width: 800px; margin: auto; }
  
  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid var(--primary); }
  .brand h1 { font-size: 28px; font-weight: 700; color: var(--primary); margin-bottom: 4px; }
  .brand .tagline { font-size: 14px; color: var(--muted); }
  .invoice-meta { text-align: right; }
  .invoice-meta h2 { font-size: 32px; font-weight: 700; color: var(--text); letter-spacing: 2px; margin-bottom: 12px; }
  .invoice-meta .meta-row { font-size: 14px; color: var(--muted); margin-bottom: 4px; }
  .invoice-meta .meta-row strong { color: var(--text); }
  
  /* Billing Section */
  .billing-section { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 40px; }
  .billing-block .label { font-size: 12px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .billing-block .name { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
  .billing-block .email { font-size: 14px; color: var(--primary); margin-bottom: 4px; }
  .billing-block .address { font-size: 14px; color: var(--muted); line-height: 1.6; white-space: pre-line; }
  
  /* Items Table */
  .items-section { margin-bottom: 32px; }
  .items-section .section-title { font-size: 12px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; }
  table thead { background: var(--primary-light); }
  table th { padding: 14px 16px; text-align: left; font-size: 13px; font-weight: 600; color: var(--primary); }
  table th.right { text-align: right; }
  table td { padding: 16px; font-size: 14px; border-bottom: 1px solid var(--border); }
  table td.right { text-align: right; font-weight: 500; }
  
  /* Summary */
  .summary-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .summary-box { width: 320px; }
  .summary-row { display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; border-bottom: 1px solid var(--border); }
  .summary-row span:first-child { color: var(--muted); }
  .summary-row.total { border-bottom: none; border-top: 2px solid var(--primary); margin-top: 8px; padding-top: 16px; font-size: 20px; font-weight: 700; }
  .summary-row.total span { color: var(--primary); }
  
  /* Payment */
  .payment-section { background: var(--primary-light); padding: 24px; border-radius: 12px; margin-bottom: 32px; }
  .payment-title { font-size: 14px; font-weight: 600; color: var(--primary); margin-bottom: 12px; }
  .payment-details { font-size: 14px; }
  .payment-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .payment-row span { color: var(--muted); }
  .payment-row strong { color: var(--text); }
  
  /* Notes */
  .notes { padding: 20px; background: #f8fafc; border-radius: 8px; margin-bottom: 32px; }
  .notes strong { font-size: 13px; color: var(--primary); display: block; margin-bottom: 8px; }
  .notes p { font-size: 14px; color: var(--muted); line-height: 1.6; }
  
  /* Footer */
  .footer { text-align: center; padding-top: 24px; border-top: 1px solid var(--border); font-size: 13px; color: var(--muted); }
  
  @media (max-width: 640px) {
    body { padding: 24px; }
    .header { flex-direction: column; gap: 24px; }
    .invoice-meta { text-align: left; }
    .billing-section { grid-template-columns: 1fr; gap: 24px; }
    .summary-box { width: 100%; }
  }
  @media print { body { padding: 16mm; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="brand">
      <h1>${invoice.companyDetails?.name || 'Your Company'}</h1>
      <div class="tagline">${invoice.companyDetails?.email || ''}</div>
    </div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <div class="meta-row">Invoice No: <strong>${invoice.invoiceNumber}</strong></div>
      <div class="meta-row">Date: <strong>${invoice.date}</strong></div>
      <div class="meta-row">Due Date: <strong>${invoice.dueDate}</strong></div>
    </div>
  </div>
  
  <div class="billing-section">
    <div class="billing-block">
      <div class="label">From</div>
      <div class="name">${invoice.companyDetails?.name || 'Your Company'}</div>
      <div class="email">${invoice.companyDetails?.email || ''}</div>
      <div class="address">${invoice.companyDetails?.address || ''}</div>
    </div>
    <div class="billing-block">
      <div class="label">Bill To</div>
      <div class="name">${invoice.client.name}</div>
      <div class="email">${invoice.client.email}</div>
      <div class="address">${invoice.client.address}</div>
    </div>
  </div>
  
  <div class="items-section">
    <div class="section-title">Items</div>
    <table>
      <thead><tr><th>Description</th><th class="right">Amount</th></tr></thead>
      <tbody>${getItemsHtml(invoice)}</tbody>
    </table>
  </div>
  
  <div class="summary-section">
    <div class="summary-box">
      <div class="summary-row"><span>Subtotal</span><span>${amounts.subtotal}</span></div>
      <div class="summary-row"><span>Tax</span><span>${amounts.tax}</span></div>
      <div class="summary-row"><span>Discount</span><span>-${amounts.discount}</span></div>
      <div class="summary-row total"><span>Total Due</span><span>${amounts.total}</span></div>
    </div>
  </div>
  
  ${getPaymentHtml(invoice, colors)}
  ${invoice.notes ? `<div class="notes"><strong>Notes</strong><p>${invoice.notes}</p></div>` : ''}
  
  <div class="footer">Thank you for your business — This is a computer-generated invoice</div>
</div>
</body>
</html>`;
};

// Template: Minimal Clean
const getMinimalCleanTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => {
  const amounts = getSummaryAmounts(invoice);
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Invoice — ${invoice.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root {
    --primary: ${colors.primary};
    --primary-light: ${colors.primaryLight};
    --text: #111827;
    --muted: #6b7280;
    --border: #e5e7eb;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "DM Sans", -apple-system, sans-serif; color: var(--text); background: #fff; padding: 48px; }
  .invoice { max-width: 780px; margin: auto; }
  
  /* Header - Clean and simple */
  .header { margin-bottom: 48px; }
  .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
  .invoice-title { font-size: 14px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }
  .invoice-number { font-size: 32px; font-weight: 700; color: var(--text); }
  .dates { display: flex; gap: 32px; font-size: 14px; color: var(--muted); }
  .dates strong { color: var(--text); display: block; margin-top: 4px; }
  
  /* Parties */
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
  .party-label { font-size: 11px; font-weight: 600; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .party-name { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .party-email { font-size: 14px; color: var(--primary); margin-bottom: 4px; }
  .party-address { font-size: 14px; color: var(--muted); line-height: 1.5; white-space: pre-line; }
  
  /* Items */
  .items { margin-bottom: 32px; }
  table { width: 100%; border-collapse: collapse; }
  table th { padding: 12px 0; text-align: left; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid var(--text); }
  table th.right { text-align: right; }
  table td { padding: 16px 0; font-size: 15px; border-bottom: 1px solid var(--border); }
  table td.right { text-align: right; font-weight: 500; }
  
  /* Summary */
  .summary { display: flex; justify-content: flex-end; margin-bottom: 40px; }
  .summary-box { width: 280px; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
  .summary-row span:first-child { color: var(--muted); }
  .summary-row.total { margin-top: 12px; padding-top: 12px; border-top: 2px solid var(--text); font-size: 18px; font-weight: 700; }
  
  /* Payment */
  .payment-section { margin-bottom: 32px; padding: 24px; border: 1px solid var(--border); border-radius: 8px; }
  .payment-title { font-size: 13px; font-weight: 600; color: var(--primary); margin-bottom: 12px; }
  .payment-details { font-size: 14px; }
  .payment-row { display: flex; justify-content: space-between; padding: 6px 0; }
  .payment-row span { color: var(--muted); }
  
  /* Notes */
  .notes { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 32px; }
  .notes strong { color: var(--text); display: block; margin-bottom: 8px; }
  
  /* Footer */
  .footer { text-align: center; font-size: 12px; color: var(--muted); padding-top: 24px; border-top: 1px solid var(--border); }
  
  @media (max-width: 640px) {
    body { padding: 24px; }
    .header-top { flex-direction: column; align-items: flex-start; gap: 16px; }
    .dates { flex-direction: column; gap: 12px; }
    .parties { grid-template-columns: 1fr; gap: 24px; }
    .summary-box { width: 100%; }
  }
  @media print { body { padding: 16mm; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="header-top">
      <div>
        <div class="invoice-title">Invoice</div>
        <div class="invoice-number">${invoice.invoiceNumber}</div>
      </div>
      <div class="dates">
        <div><span>Issue Date</span><strong>${invoice.date}</strong></div>
        <div><span>Due Date</span><strong>${invoice.dueDate}</strong></div>
      </div>
    </div>
  </div>
  
  <div class="parties">
    <div>
      <div class="party-label">From</div>
      <div class="party-name">${invoice.companyDetails?.name || 'Your Company'}</div>
      <div class="party-email">${invoice.companyDetails?.email || ''}</div>
      <div class="party-address">${invoice.companyDetails?.address || ''}</div>
    </div>
    <div>
      <div class="party-label">Bill To</div>
      <div class="party-name">${invoice.client.name}</div>
      <div class="party-email">${invoice.client.email}</div>
      <div class="party-address">${invoice.client.address}</div>
    </div>
  </div>
  
  <div class="items">
    <table>
      <thead><tr><th>Description</th><th class="right">Amount</th></tr></thead>
      <tbody>${getItemsHtml(invoice)}</tbody>
    </table>
  </div>
  
  <div class="summary">
    <div class="summary-box">
      <div class="summary-row"><span>Subtotal</span><span>${amounts.subtotal}</span></div>
      <div class="summary-row"><span>Tax</span><span>${amounts.tax}</span></div>
      <div class="summary-row"><span>Discount</span><span>-${amounts.discount}</span></div>
      <div class="summary-row total"><span>Total</span><span>${amounts.total}</span></div>
    </div>
  </div>
  
  ${getPaymentHtml(invoice, colors)}
  ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
  
  <div class="footer">Computer-generated invoice — No signature required</div>
</div>
</body>
</html>`;
};

// Template 1: Card Based Modern
const getCardBasedTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => {
  const amounts = getSummaryAmounts(invoice);
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Invoice — ${invoice.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root {
    --primary: ${colors.primary};
    --primary-light: ${colors.primaryLight};
    --text: #0F172A;
    --muted: #64748B;
    --border: #E5E7EB;
    --bg: #F3F4F6;
    --card: #FFFFFF;
  }
  body { margin: 0; padding: 28px; background: var(--bg); font-family: "Space Grotesk", sans-serif; color: var(--text); }
  .invoice { max-width: 820px; margin: auto; display: grid; gap: 20px; }
  .card { background: var(--card); border-radius: 18px; border: 1px solid var(--border); padding: 24px 28px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; background: var(--primary-light); color: var(--primary); }
  .header-right h1 { margin: 0; font-size: 38px; font-weight: 700; text-align: right; }
  .meta { margin-top: 10px; font-size: 14px; color: var(--primary); text-align: right; }
  .section-title { font-size: 15px; font-weight: 600; color: var(--primary); margin-bottom: 10px; }
  .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
  .info-block strong { font-size: 16px; }
  .email { color: var(--muted); font-size: 14px; margin: 6px 0; }
  .address { font-size: 14px; line-height: 1.55; white-space: pre-line; }
  table { width: 100%; border-collapse: collapse; }
  table th { text-align: left; padding: 12px 0; font-size: 14px; color: var(--primary); border-bottom: 2px solid var(--primary); }
  table td { padding: 14px 0; border-bottom: 1px solid var(--border); font-size: 15px; }
  .right { text-align: right; }
  .summary-box { width: 320px; margin-left: auto; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .summary-row.total { border-top: 2px solid var(--primary); margin-top: 10px; padding-top: 12px; font-size: 20px; font-weight: 700; color: var(--primary); }
  .payment-section { margin-top: 16px; }
  .payment-title { font-weight: 600; font-size: 15px; color: var(--primary); margin-bottom: 10px; }
  .payment-details { font-size: 14px; }
  .payment-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--border); }
  .payment-row span { color: var(--muted); }
  .notes { color: var(--muted); font-size: 14px; line-height: 1.5; margin-top: 16px; }
  .footer { text-align: center; font-size: 13px; color: var(--muted); padding-top: 6px; }
  @media(max-width:640px) {
    .billing-grid { grid-template-columns: 1fr; }
    .summary-box { width: 100%; }
    .header { flex-direction: column; gap: 14px; text-align: left; }
  }
  @media print { body { padding: 0; background: #fff; } .invoice { gap: 12px; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="card header">
    <div class="header-right">
      <h1>INVOICE</h1>
      <div class="meta">
        <div>Invoice No: <strong>${invoice.invoiceNumber}</strong></div>
        <div>Date: <strong>${invoice.date}</strong></div>
        <div>Due Date: <strong>${invoice.dueDate}</strong></div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="section-title">Billing Details</div>
    <div class="billing-grid">
      <div class="info-block">
        ${getCompanyHtml(invoice)}
      </div>
      <div class="info-block">
        <strong>${invoice.client.name}</strong>
        <div class="email">${invoice.client.email}</div>
        <div class="address">${invoice.client.address}</div>
      </div>
    </div>
  </div>
  <div class="card">
    <div class="section-title">Items</div>
    <table>
      <thead><tr><th>Description</th><th class="right">Price</th></tr></thead>
      <tbody>${getItemsHtml(invoice)}</tbody>
    </table>
  </div>
  <div class="card summary-box">
    <div class="summary-row"><span>Subtotal</span><span>${amounts.subtotal}</span></div>
    <div class="summary-row"><span>Tax</span><span>${amounts.tax}</span></div>
    <div class="summary-row"><span>Discount</span><span>-${amounts.discount}</span></div>
    <div class="summary-row total"><span>Total</span><span>${amounts.total}</span></div>
  </div>
  <div class="card">
    ${getPaymentHtml(invoice, colors)}
    ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
  </div>
  <div class="footer">This is a computer-generated invoice — no signature required.</div>
</div>
</body>
</html>`;
};

// Template 2: Clean Header
const getCleanHeaderTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => {
  const amounts = getSummaryAmounts(invoice);
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Invoice — ${invoice.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root { --primary: ${colors.primary}; --primary-light: ${colors.primaryLight}; --text: #0F172A; --muted: #64748B; --border: #E5E7EB; --bg: #F8FAFC; }
  body { margin: 0; padding: 32px; background: var(--bg); font-family: "Space Grotesk", sans-serif; color: var(--text); }
  .invoice { max-width: 820px; margin: auto; background: white; border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
  .header { background: var(--primary-light); padding: 32px 40px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
  .header-right h1 { margin: 0; font-size: 40px; font-weight: 700; color: var(--primary); text-align: right; }
  .meta { margin-top: 10px; font-size: 14px; color: var(--primary); text-align: right; }
  .section { padding: 28px 40px; border-bottom: 1px solid var(--border); }
  .section:last-child { border-bottom: none; }
  .section-title { font-size: 15px; font-weight: 600; color: var(--primary); margin-bottom: 10px; }
  .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .info-block strong { font-size: 16px; }
  .email { color: var(--muted); font-size: 14px; margin: 6px 0; }
  .address { font-size: 14px; line-height: 1.55; white-space: pre-line; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  table th { padding: 12px 0; font-size: 14px; color: var(--primary); border-bottom: 2px solid var(--primary); text-align: left; }
  table td { padding: 14px 0; border-bottom: 1px solid var(--border); font-size: 15px; }
  .right { text-align: right; }
  .summary-box { max-width: 320px; margin-left: auto; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .summary-row.total { margin-top: 10px; padding-top: 12px; border-top: 2px solid var(--primary); font-size: 20px; font-weight: 700; color: var(--primary); }
  .payment-section { margin-top: 16px; }
  .payment-title { font-weight: 600; font-size: 15px; color: var(--primary); margin-bottom: 10px; }
  .payment-details { font-size: 14px; }
  .payment-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--border); }
  .payment-row span { color: var(--muted); }
  .notes { font-size: 14px; color: var(--muted); line-height: 1.5; margin-top: 16px; }
  .footer { font-size: 13px; color: var(--muted); text-align: center; padding: 18px; }
  @media (max-width: 640px) { .billing-grid { grid-template-columns: 1fr; } .header { flex-direction: column; gap: 16px; } .header-right { text-align: left; } .meta { text-align: left; } }
  @media print { body { padding: 0; background: #fff; } .invoice { border-radius: 0; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="header-right">
      <h1>INVOICE</h1>
      <div class="meta">
        <div>Invoice No: <strong>${invoice.invoiceNumber}</strong></div>
        <div>Date: <strong>${invoice.date}</strong></div>
        <div>Due Date: <strong>${invoice.dueDate}</strong></div>
      </div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Billing Details</div>
    <div class="billing-grid">
      <div class="info-block">${getCompanyHtml(invoice)}</div>
      <div class="info-block"><strong>${invoice.client.name}</strong><div class="email">${invoice.client.email}</div><div class="address">${invoice.client.address}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Items</div>
    <table><thead><tr><th>Description</th><th class="right">Price</th></tr></thead><tbody>${getItemsHtml(invoice)}</tbody></table>
  </div>
  <div class="section">
    <div class="summary-box">
      <div class="summary-row"><span>Subtotal</span><span>${amounts.subtotal}</span></div>
      <div class="summary-row"><span>Tax</span><span>${amounts.tax}</span></div>
      <div class="summary-row"><span>Discount</span><span>-${amounts.discount}</span></div>
      <div class="summary-row total"><span>Total</span><span>${amounts.total}</span></div>
    </div>
  </div>
  <div class="section">
    ${getPaymentHtml(invoice, colors)}
    ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
  </div>
  <div class="footer">This is a computer-generated invoice — no signature required.</div>
</div>
</body>
</html>`;
};

// Template 3: Ultra Minimal
const getUltraMinimalTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => {
  const amounts = getSummaryAmounts(invoice);
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Invoice — ${invoice.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root { --text: #0F172A; --muted: #64748B; --line: #E5E7EB; --primary: ${colors.primary}; }
  body { margin: 0; padding: 48px; font-family: "Space Grotesk", sans-serif; color: var(--text); background: #ffffff; }
  .invoice { max-width: 780px; margin: auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 1px solid var(--line); }
  .header-right { text-align: right; font-size: 14px; color: var(--muted); line-height: 1.6; }
  .header-right h1 { margin: 0 0 10px 0; font-size: 36px; font-weight: 700; color: var(--text); letter-spacing: 1px; }
  .section { padding: 26px 0; border-bottom: 1px solid var(--line); }
  .section:last-child { border-bottom: none; }
  .section-title { font-size: 14px; font-weight: 600; margin-bottom: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }
  .billing { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; font-size: 15px; }
  .billing strong { font-size: 16px; }
  .email { color: var(--muted); font-size: 14px; margin: 4px 0; }
  .address { font-size: 14px; line-height: 1.6; white-space: pre-line; }
  table { width: 100%; border-collapse: collapse; }
  table th { text-align: left; padding-bottom: 12px; font-size: 14px; color: var(--muted); font-weight: 500; }
  table td { padding: 14px 0; font-size: 15px; }
  .right { text-align: right; }
  .summary { max-width: 320px; margin-left: auto; font-size: 15px; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .summary-row.total { margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); font-weight: 700; font-size: 18px; }
  .payment-section { margin-top: 16px; }
  .payment-title { font-weight: 600; margin-bottom: 10px; }
  .payment-details { font-size: 14px; }
  .payment-row { display: flex; justify-content: space-between; padding: 6px 0; }
  .payment-row span { color: var(--muted); }
  .notes { font-size: 14px; color: var(--muted); line-height: 1.6; margin-top: 16px; }
  .footer { padding-top: 30px; text-align: center; font-size: 13px; color: var(--muted); }
  @media (max-width: 640px) { .billing { grid-template-columns: 1fr; } .header { flex-direction: column; gap: 16px; } .header-right { text-align: left; } }
  @media print { body { padding: 16mm; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <div class="header-right">
      <h1>INVOICE</h1>
      <div>Invoice No: <strong>${invoice.invoiceNumber}</strong></div>
      <div>Date: <strong>${invoice.date}</strong></div>
      <div>Due Date: <strong>${invoice.dueDate}</strong></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Billing</div>
    <div class="billing">
      <div>${getCompanyHtml(invoice)}</div>
      <div><strong>${invoice.client.name}</strong><div class="email">${invoice.client.email}</div><div class="address">${invoice.client.address}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">Items</div>
    <table><thead><tr><th>Description</th><th class="right">Price</th></tr></thead><tbody>${getItemsHtml(invoice)}</tbody></table>
  </div>
  <div class="section">
    <div class="summary">
      <div class="summary-row"><span>Subtotal</span><span>${amounts.subtotal}</span></div>
      <div class="summary-row"><span>Tax</span><span>${amounts.tax}</span></div>
      <div class="summary-row"><span>Discount</span><span>-${amounts.discount}</span></div>
      <div class="summary-row total"><span>Total</span><span>${amounts.total}</span></div>
    </div>
  </div>
  <div class="section">
    ${getPaymentHtml(invoice, colors)}
    ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
  </div>
  <div class="footer">This is a computer-generated invoice — no signature required.</div>
</div>
</body>
</html>`;
};

// Template: Minimalist
const getMinimalistTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => {
  const amounts = getSummaryAmounts(invoice);
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Invoice — ${invoice.invoiceNumber}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  :root { --primary: ${colors.primary}; --text: #0F172A; --muted: #64748B; --border: #E5E7EB; }
  body { margin: 0; padding: 48px; font-family: "Space Grotesk", sans-serif; color: var(--text); }
  .invoice { max-width: 780px; margin: auto; }
  .header { display: flex; justify-content: space-between; margin-bottom: 48px; }
  h1 { margin: 0; font-size: 32px; font-weight: 700; color: var(--primary); }
  .meta { text-align: right; font-size: 14px; color: var(--muted); }
  .billing { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
  .email { color: var(--muted); font-size: 14px; margin: 4px 0; }
  .address { white-space: pre-line; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  table th { text-align: left; padding: 12px 0; border-bottom: 2px solid var(--primary); color: var(--primary); }
  table td { padding: 14px 0; border-bottom: 1px solid var(--border); }
  .right { text-align: right; }
  .summary { max-width: 300px; margin-left: auto; }
  .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
  .summary-row.total { border-top: 2px solid var(--primary); font-weight: 700; font-size: 18px; color: var(--primary); }
  .payment-section { margin-top: 32px; }
  .payment-title { font-weight: 600; color: var(--primary); margin-bottom: 10px; }
  .payment-details { font-size: 14px; }
  .payment-row { display: flex; justify-content: space-between; padding: 6px 0; }
  .payment-row span { color: var(--muted); }
  .notes { margin-top: 16px; font-size: 14px; color: var(--muted); }
  .footer { margin-top: 48px; text-align: center; font-size: 13px; color: var(--muted); }
  @media (max-width: 640px) { .billing { grid-template-columns: 1fr; } .header { flex-direction: column; gap: 16px; } }
  @media print { body { padding: 16mm; } }
</style>
</head>
<body>
<div class="invoice">
  <div class="header">
    <h1>INVOICE</h1>
    <div class="meta">
      <div>No: ${invoice.invoiceNumber}</div>
      <div>${invoice.date}</div>
      <div>Due: ${invoice.dueDate}</div>
    </div>
  </div>
  <div class="billing">
    <div>${getCompanyHtml(invoice)}</div>
    <div><strong>${invoice.client.name}</strong><div class="email">${invoice.client.email}</div><div class="address">${invoice.client.address}</div></div>
  </div>
  <table><thead><tr><th>Description</th><th class="right">Amount</th></tr></thead><tbody>${getItemsHtml(invoice)}</tbody></table>
  <div class="summary">
    <div class="summary-row"><span>Subtotal</span><span>${amounts.subtotal}</span></div>
    <div class="summary-row"><span>Tax</span><span>${amounts.tax}</span></div>
    <div class="summary-row"><span>Discount</span><span>-${amounts.discount}</span></div>
    <div class="summary-row total"><span>Total</span><span>${amounts.total}</span></div>
  </div>
  ${getPaymentHtml(invoice, colors)}
  ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ''}
  <div class="footer">Computer-generated invoice — no signature required</div>
</div>
</body>
</html>`;
};

// Additional template stubs for other variants
const getAsymmetricTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => getCardBasedTemplate(invoice, colors);
const getFloatingSummaryTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => getCleanHeaderTemplate(invoice, colors);
const getSectionDividerTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => getUltraMinimalTemplate(invoice, colors);
const getEditorialLuxuryTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => getCardBasedTemplate(invoice, colors);
const getBlackEdgeTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => getCleanHeaderTemplate(invoice, colors);
const getGoldAccentTemplate = (invoice: Invoice) => {
  const colors = { primary: '#B8860B', primaryLight: '#FFF8E7' };
  return getCardBasedTemplate(invoice, colors);
};
const getPaymentFocusTemplate = (invoice: Invoice, colors: { primary: string; primaryLight: string }) => getCardBasedTemplate(invoice, colors);

const getModernVariantTemplate = (variant: string, invoice: Invoice): string => {
  const colors = getColorScheme(invoice.colorScheme);
  
  switch (variant) {
    case 'classic-modern':
      return getClassicModernTemplate(invoice, colors);
    case 'minimal-clean':
      return getMinimalCleanTemplate(invoice, colors);
    case 'card-based':
      return getCardBasedTemplate(invoice, colors);
    case 'clean-header':
      return getCleanHeaderTemplate(invoice, colors);
    case 'ultra-minimal':
      return getUltraMinimalTemplate(invoice, colors);
    case 'asymmetric':
      return getAsymmetricTemplate(invoice, colors);
    case 'floating-summary':
      return getFloatingSummaryTemplate(invoice, colors);
    case 'section-divider':
      return getSectionDividerTemplate(invoice, colors);
    case 'editorial-luxury':
      return getEditorialLuxuryTemplate(invoice, colors);
    case 'black-edge':
      return getBlackEdgeTemplate(invoice, { primary: '#18181B', primaryLight: '#F4F4F5' });
    case 'gold-accent':
      return getGoldAccentTemplate(invoice);
    case 'payment-focus':
      return getPaymentFocusTemplate(invoice, colors);
    default:
      return getClassicModernTemplate(invoice, colors);
  }
};

export const getInvoiceHtml = (invoice: Invoice): string => {
  if (invoice.template === 'minimalist') {
    const colors = getColorScheme(invoice.colorScheme);
    return getMinimalistTemplate(invoice, colors);
  } else {
    return getModernVariantTemplate(invoice.templateVariant || 'classic-modern', invoice);
  }
};

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
  const html = getInvoiceHtml(invoice);
  
  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentWindow?.document;
  if (iframeDoc) {
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
    // Wait for content to load then trigger print (save as PDF)
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
        // Remove iframe after a delay
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 250);
    };
  }
};
