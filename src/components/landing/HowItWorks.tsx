import { motion } from "framer-motion";
import { FileText, Palette, Send } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: FileText,
      title: "Enter Invoice Details",
      description:
        "Add your client information, line items, and amounts. Our smart form auto-calculates totals and taxes.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      step: "02",
      icon: Palette,
      title: "Choose Your Style",
      description:
        "Select from 10+ premium templates and customize colors to match your brand identity perfectly.",
      color: "from-violet-500 to-purple-500",
    },
    {
      step: "03",
      icon: Send,
      title: "Download & Share",
      description:
        "Export as a professional PDF or share via a unique invoice link. Your client can view it instantly.",
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
            🚀 Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Create professional invoices in just three simple steps.
            No learning curve, no complexity – just results.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          {/* ONLY CHANGE IS HERE */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl border border-border p-8 h-full hover:shadow-xl hover:border-primary/20 transition-all duration-300 group">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8">
                    <span
                      className={`inline-flex items-center justify-center h-8 w-12 rounded-full bg-gradient-to-r ${step.color} text-white text-sm font-bold shadow-lg`}
                    >
                      {step.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`mt-4 mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className="h-8 w-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                      →
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;