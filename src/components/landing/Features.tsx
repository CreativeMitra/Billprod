import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Palette,
  Download,
  Clock,
  Cloud,
  Smartphone,
  CreditCard,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: FileText,
      title: "Quick Invoice Creation",
      description:
        "Create professional invoices in under 30 seconds. Auto-calculate totals and taxes.",
    },
    {
      icon: Users,
      title: "Client Management",
      description:
        "Save client details and auto-fill them when creating new invoices.",
    },
    {
      icon: Palette,
      title: "Premium Templates",
      description:
        "Choose from 2 beautiful styles: Minimal and Modern.",
    },
    {
      icon: Download,
      title: "Instant PDF Export",
      description:
        "Download high-quality PDF invoices with one click. Share instantly.",
    },
    {
      icon: Clock,
      title: "Invoice History",
      description:
        "Track all invoices. Mark as paid/unpaid. Filter by date or status.",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description:
        "All your invoices saved securely in the cloud. Access anywhere.",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description:
        "Create invoices on the go. Works perfectly on any device.",
    },
    {
      icon: CreditCard,
      title: "Payment Links",
      description:
        "Add Razorpay or UPI payment links directly in your invoices.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to bill clients
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple, powerful tools designed for Indian freelancers. No complexity, just results.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-card rounded-xl border border-border p-6 card-hover"
            >
              {/* Icon */}
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
