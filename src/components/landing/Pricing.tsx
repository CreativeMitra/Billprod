import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Pricing = () => {
  const features = [
    "Unlimited invoices",
    "3 premium templates",
    "Client management",
    "Invoice history & tracking",
    "Custom branding (logo + color)",
    "PDF export",
    "Payment link integration",
    "Cloud storage",
    "Mobile-friendly",
    "Priority support",
  ];

  return (
    <section id="pricing" className="py-20">
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
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            One plan with everything you need. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur-lg opacity-20" />
            
            <div className="relative bg-card rounded-2xl border-2 border-primary/20 shadow-xl overflow-hidden">
              {/* Popular Badge */}
              <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                <Zap className="h-4 w-4 inline mr-1" />
                7-Day Free Trial • No Credit Card Required
              </div>

              <div className="p-8">
                {/* Price */}
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground mb-2">Pro Plan</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold text-foreground">₹499</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    or ₹4,999/year (save 16%)
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center">
                        <Check className="h-3 w-3 text-accent" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/dashboard">
                  <Button variant="hero" size="xl" className="w-full">
                    Start 7-Day Free Trial
                  </Button>
                </Link>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Cancel anytime. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>Secure payments via Razorpay</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>GST invoice available</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-accent" />
              <span>24/7 email support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
