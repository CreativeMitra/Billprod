import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Invoice } from "@/types/invoice";
import { getInvoiceHtml } from "@/utils/pdfGenerator";

const InvoiceView = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!invoiceId) {
        setError("Invalid invoice link");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("invoices")
        .select("invoice_data")
        .eq("public_id", invoiceId)
        .single();

      if (error || !data) {
        setError("Invoice not found");
        setLoading(false);
        return;
      }

      setInvoice(data.invoice_data as Invoice);
      setLoading(false);
    };

    fetchInvoice();
  }, [invoiceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Invoice Not Found
          </h1>
          <p className="text-muted-foreground">
            {error || "The requested invoice does not exist."}
          </p>
        </div>
      </div>
    );
  }

  const html = getInvoiceHtml(invoice);

  return (
    <div className="min-h-screen bg-muted/30 py-4 px-4">
      <div className="max-w-[900px] mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
        <iframe
          srcDoc={html}
          className="w-full min-h-screen border-0"
          title={`Invoice ${invoice.invoiceNumber}`}
        />
      </div>
    </div>
  );
};

export default InvoiceView;