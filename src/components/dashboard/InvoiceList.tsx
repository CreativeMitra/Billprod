import { useState } from "react";
import { FileText, Download, Filter, Search, Trash2, Copy, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Invoice } from "@/types/invoice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface InvoiceListProps {
  invoices: Invoice[];
  onDownload: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onDuplicate: (invoice: Invoice) => void;
  onUpdateStatus: (id: string, status: 'paid' | 'pending' | 'overdue') => void;
}

const InvoiceList = ({ invoices, onDownload, onDelete, onDuplicate, onUpdateStatus }: InvoiceListProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const handleShare = async (invoice: Invoice) => {
    const shareUrl = `${window.location.origin}/invoice/${invoice.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Invoice link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === "all" || invoice.status === filter;
    const matchesSearch = invoice.client.name.toLowerCase().includes(search.toLowerCase()) ||
                          invoice.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No invoices yet</h3>
          <p className="text-muted-foreground">Create your first invoice to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Invoice History</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full sm:w-[200px]"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{invoice.client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.invoiceNumber} • {formatDate(invoice.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-left sm:text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(invoice.total)}</p>
                  <Select 
                    value={invoice.status} 
                    onValueChange={(value) => onUpdateStatus(invoice.id, value as 'paid' | 'pending' | 'overdue')}
                  >
                    <SelectTrigger className={`h-6 text-xs border-0 p-0 w-auto ${
                      invoice.status === "paid" ? "text-success" :
                      invoice.status === "pending" ? "text-warning" :
                      "text-destructive"
                    }`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(invoice)}
                    title="Share Link"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDuplicate(invoice)}
                    title="Duplicate"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownload(invoice)}
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      onDelete(invoice.id);
                      toast.success("Invoice deleted");
                    }}
                    title="Delete"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceList;
