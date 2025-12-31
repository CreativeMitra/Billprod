import { Link } from "react-router-dom";
import { Zap, LayoutDashboard, FileText, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeTab: 'dashboard' | 'invoices' | 'clients';
  onTabChange: (tab: 'dashboard' | 'invoices' | 'clients') => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices' as const, label: 'Invoices', icon: FileText },
    { id: 'clients' as const, label: 'Clients', icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 hidden lg:block">
      <Link to="/" className="flex items-center gap-2 mb-10">
        <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
          <Zap className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold">Bill<span className="text-primary">Fast</span></span>
      </Link>

      <nav className="space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
            <LogOut className="h-5 w-5" />
            Log out
          </Button>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
