import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const Templates = () => {
  const templates = [
    {
      name: "Minimal",
      description: "Clean and simple. Perfect for tech freelancers.",
      gradient: "from-slate-100 to-slate-50",
      accent: "bg-slate-800",
    },
    {
      name: "Modern",
      description: "Bold and professional. Great for agencies.",
      gradient: "from-primary/10 to-accent/5",
      accent: "bg-primary",
    },
  ];

  return (
    <section id="templates" className="py-20 bg-secondary/30">
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
            Templates
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Professional templates that impress
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose from 2 carefully designed templates. Each one crafted to make your invoices look premium.
          </p>
        </motion.div>

        {/* Templates Grid */}
        {/* ONLY CHANGE IS HERE */}
        <div className="grid md:grid-cols-2 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              {/* Template Preview */}
              <div className="relative rounded-xl overflow-hidden border border-border bg-card shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                {/* Mock Invoice */}
                <div className={`bg-gradient-to-br ${template.gradient} p-6 min-h-[280px]`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg ${template.accent} flex items-center justify-center`}>
                        <Zap className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="h-2 w-16 bg-foreground/20 rounded" />
                    </div>
                    <div className="text-right">
                      <div className="h-2 w-12 bg-foreground/10 rounded mb-1 ml-auto" />
                      <div className="h-2 w-16 bg-foreground/20 rounded" />
                    </div>
                  </div>

                  {/* Content Lines */}
                  <div className="space-y-3 mb-6">
                    <div className="h-2 w-24 bg-foreground/10 rounded" />
                    <div className="h-2 w-32 bg-foreground/20 rounded" />
                    <div className="h-2 w-28 bg-foreground/10 rounded" />
                  </div>

                  {/* Table */}
                  <div className="bg-card/60 backdrop-blur rounded-lg p-3 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-2 w-20 bg-foreground/20 rounded" />
                      <div className="h-2 w-12 bg-foreground/20 rounded" />
                    </div>
                    <div className="flex justify-between">
                      <div className="h-2 w-24 bg-foreground/10 rounded" />
                      <div className="h-2 w-10 bg-foreground/10 rounded" />
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-end mt-4">
                    <div className={`h-3 w-20 ${template.accent} rounded opacity-80`} />
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4 bg-card border-t border-border">
                  <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Templates;