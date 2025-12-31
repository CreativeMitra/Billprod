import { motion } from "framer-motion";
import { FileText, TrendingUp, Clock, IndianRupee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalInvoices: number;
  paidAmount: number;
  pendingAmount: number;
  thisMonthRevenue: number;
}

const DashboardStats = ({
  totalInvoices,
  paidAmount,
  pendingAmount,
  thisMonthRevenue,
}: DashboardStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    { title: "Total Invoices", value: totalInvoices.toString(), icon: FileText, color: "text-primary" },
    { title: "Paid Amount", value: formatCurrency(paidAmount), icon: TrendingUp, color: "text-success" },
    { title: "Pending", value: formatCurrency(pendingAmount), icon: Clock, color: "text-warning" },
    { title: "This Month", value: formatCurrency(thisMonthRevenue), icon: IndianRupee, color: "text-accent" },
  ];

  return (
    // ✅ ONLY CHANGE IS HERE
    <div className="flex flex-col gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`h-12 w-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;