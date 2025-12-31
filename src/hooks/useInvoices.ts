import { useState, useEffect } from 'react';
import { Invoice, Client } from '@/types/invoice';

const STORAGE_KEY_INVOICES = 'billfast_invoices';
const STORAGE_KEY_CLIENTS = 'billfast_clients';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const storedInvoices = localStorage.getItem(STORAGE_KEY_INVOICES);
    const storedClients = localStorage.getItem(STORAGE_KEY_CLIENTS);
    
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
    }
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  const saveInvoices = (newInvoices: Invoice[]) => {
    setInvoices(newInvoices);
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(newInvoices));
  };

  const saveClients = (newClients: Client[]) => {
    setClients(newClients);
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(newClients));
  };

  const addInvoice = (invoice: Invoice) => {
    const newInvoices = [invoice, ...invoices];
    saveInvoices(newInvoices);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const newInvoices = invoices.map(inv => 
      inv.id === id ? { ...inv, ...updates } : inv
    );
    saveInvoices(newInvoices);
  };

  const deleteInvoice = (id: string) => {
    const newInvoices = invoices.filter(inv => inv.id !== id);
    saveInvoices(newInvoices);
  };

  const addClient = (client: Client) => {
    const newClients = [...clients, client];
    saveClients(newClients);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const newClients = clients.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    saveClients(newClients);
  };

  const deleteClient = (id: string) => {
    const newClients = clients.filter(c => c.id !== id);
    saveClients(newClients);
  };

  const getStats = () => {
    const totalInvoices = invoices.length;
    const paidAmount = invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.total, 0);
    
    const now = new Date();
    const thisMonthRevenue = invoices
      .filter(inv => {
        const invDate = new Date(inv.date);
        return invDate.getMonth() === now.getMonth() && 
               invDate.getFullYear() === now.getFullYear() &&
               inv.status === 'paid';
      })
      .reduce((sum, inv) => sum + inv.total, 0);

    return { totalInvoices, paidAmount, pendingAmount, thisMonthRevenue };
  };

  const generateInvoiceNumber = () => {
    const count = invoices.length + 1;
    return `INV-${String(count).padStart(3, '0')}`;
  };

  return {
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
  };
};
