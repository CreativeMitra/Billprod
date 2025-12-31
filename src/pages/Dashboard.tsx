import { useState } from "react";
import { Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInvoices } from "@/hooks/useInvoices";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import InvoiceList from "@/components/dashboard/InvoiceList";
import ClientList from "@/components/dashboard/ClientList";
import CreateInvoice from "@/components/dashboard/CreateInvoice";
import { generateInvoicePDF } from "@/utils/pdfGenerator";
import { Invoice } from "@/types/invoice";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients'>('dashboard');
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [duplicateInvoice, setDuplicateInvoice] = useState<Invoice | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    invoices,
    clients,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addClient,
    updateClient,
    deleteClient,
    getStats,
    generateInvoiceNumber,
  } = useInvoices();

  const stats = getStats();

  const handleDownload = (invoice: Invoice) => {
    generateInvoicePDF(invoice);
  };

  const handleDuplicate = (invoice: Invoice) => {
    setDuplicateInvoice(invoice);
    setShowCreateInvoice(true);
  };

  const handleCreateInvoice = (invoice: Invoice) => {
    addInvoice(invoice);
    setDuplicateInvoice(null);
  };

  const handleCloseCreateInvoice = () => {
    setShowCreateInvoice(false);
    setDuplicateInvoice(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
        <span className="text-xl font-bold">Bill<span className="text-primary">Fast</span></span>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-card z-40 p-4">
          <nav className="space-y-2">
            {(['dashboard', 'invoices', 'clients'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium capitalize ${
                  activeTab === tab ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      )}

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10 pt-20 lg:pt-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground capitalize">{activeTab}</h1>
            <p className="text-muted-foreground">
              {activeTab === 'dashboard' && 'Welcome back! Here\'s your overview.'}
              {activeTab === 'invoices' && 'Manage and track all your invoices.'}
              {activeTab === 'clients' && 'Manage your client information.'}
            </p>
          </div>
          {(activeTab === 'dashboard' || activeTab === 'invoices') && (
            <Button 
              variant="hero" 
              className="gap-2"
              onClick={() => setShowCreateInvoice(true)}
            >
              <Plus className="h-5 w-5" />
              New Invoice
            </Button>
          )}
        </div>

        {/* Dashboard View - Only show stats */}
        {activeTab === 'dashboard' && (
          <DashboardStats
            totalInvoices={stats.totalInvoices}
            paidAmount={stats.paidAmount}
            pendingAmount={stats.pendingAmount}
            thisMonthRevenue={stats.thisMonthRevenue}
          />
        )}

        {/* Invoices View */}
        {activeTab === 'invoices' && (
          <InvoiceList
            invoices={invoices}
            onDownload={handleDownload}
            onDelete={deleteInvoice}
            onDuplicate={handleDuplicate}
            onUpdateStatus={(id, status) => updateInvoice(id, { status })}
          />
        )}

        {/* Clients View */}
        {activeTab === 'clients' && (
          <ClientList
            clients={clients}
            onAdd={addClient}
            onUpdate={updateClient}
            onDelete={deleteClient}
          />
        )}
      </main>

      {/* Create Invoice Modal */}
      <CreateInvoice
        isOpen={showCreateInvoice}
        onClose={handleCloseCreateInvoice}
        clients={clients}
        onSave={handleCreateInvoice}
        invoiceNumber={generateInvoiceNumber()}
        duplicateFrom={duplicateInvoice}
      />
    </div>
  );
};

export default Dashboard;
