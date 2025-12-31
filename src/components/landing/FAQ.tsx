import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const FAQ = () => {
  const faqs = [
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 7-day free trial with full access to all features. No credit card required to start. You can create unlimited invoices during the trial period.",
    },
    {
      question: "How does multi-currency support work?",
      answer: "You can create invoices in any currency and convert them to your preferred output currency. We use real-time exchange rates, and you can also set custom rates. Both the original and converted amounts are displayed on the invoice.",
    },
    {
      question: "Can I customize the invoice templates?",
      answer: "Absolutely! Each template can be customized with your brand colors, logo, and company details. We offer 10+ professionally designed templates that look great on any device.",
    },
    {
      question: "How do shareable invoice links work?",
      answer: "Every invoice gets a unique, secure link that you can share with clients. When they open it, they see a beautiful, responsive version of the invoice with the option to download it as a PDF.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest using bank-level encryption. We perform regular security audits and never share your data with third parties.",
    },
    {
      question: "Can I export my invoices?",
      answer: "Yes! You can export individual invoices as PDFs or export your entire invoice history as a CSV file for accounting purposes. All exports are instant and free.",
    },
    {
      question: "Do you support recurring invoices?",
      answer: "Yes, you can set up recurring invoices for subscription-based clients. Choose weekly, monthly, quarterly, or yearly billing cycles, and we'll automatically generate and send invoices.",
    },
    {
      question: "What payment methods can I add to invoices?",
      answer: "You can add PayPal, Stripe, bank transfer details, or any custom payment instructions to your invoices. This makes it easy for clients to pay you in their preferred method.",
    },
    {
      question: "Can I use BillFast on mobile?",
      answer: "Yes! BillFast is fully responsive and works perfectly on phones, tablets, and desktops. Create and manage invoices on the go from any device.",
    },
    {
      question: "What happens after the trial ends?",
      answer: "After your 7-day trial, you can upgrade to our Pro plan to continue using BillFast. If you choose not to upgrade, your data remains safe and you can access it anytime you decide to subscribe.",
    },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Column - Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Got questions? We've got answers. If you don't find what you're looking for, 
              feel free to reach out to our support team.
            </p>

            {/* Contact Card */}
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Still have questions?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is here to help you 24/7. Average response time is under 2 hours.
                  </p>
                  <Button variant="outline" size="sm">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-lg data-[state=open]:border-primary/20 transition-all"
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
