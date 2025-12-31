import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const benefits = [
    "Create invoices in 30 seconds",
    "Premium templates",
    "Unlimited invoices",
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4" />
              <span>7-day free trial • No credit card</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
              Invoice clients in{" "}
              <span className="text-gradient">30 seconds</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              The fastest way for Indian freelancers to create professional invoices. 
              Beautiful templates, instant PDF downloads, and cloud storage.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                  <span>{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/dashboard">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#templates">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  View Templates
                </Button>
              </a>
            </div>

            {/* Trust Signal */}
            <p className="text-sm text-muted-foreground mt-6">
              Trusted by <span className="font-semibold text-foreground">2,500+</span> freelancers across India
            </p>
          </motion.div>

          {/* Right Content - Invoice Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Floating Invoice Card */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-2xl transform rotate-3" />
              <div className="relative bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                {/* Invoice Header */}
                <div className="bg-primary/5 px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Your Business</p>
                        <p className="text-xs text-muted-foreground">yourname@email.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Invoice #</p>
                      <p className="font-mono font-semibold text-foreground">INV-001</p>
                    </div>
                  </div>
                </div>

                {/* Invoice Content */}
                <div className="px-6 py-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bill To</p>
                      <p className="font-medium text-foreground">Acme Corporation</p>
                      <p className="text-sm text-muted-foreground">client@acme.com</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                      <p className="font-medium text-foreground">Dec 25, 2024</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50">
                        <tr>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Item</th>
                          <th className="text-right px-3 py-2 text-muted-foreground font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-border">
                          <td className="px-3 py-2 text-foreground">Website Design</td>
                          <td className="px-3 py-2 text-right text-foreground">₹25,000</td>
                        </tr>
                        <tr className="border-t border-border">
                          <td className="px-3 py-2 text-foreground">Development</td>
                          <td className="px-3 py-2 text-right text-foreground">₹45,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">₹70,000</span>
                  </div>
                </div>

                {/* Invoice Footer */}
                <div className="px-6 py-4 bg-accent/5 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">
                      Pending
                    </span>
                    <Button size="sm" variant="default">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-card rounded-xl shadow-lg border border-border px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment</p>
                  <p className="text-sm font-semibold text-success">Received</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
