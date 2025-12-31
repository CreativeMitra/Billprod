import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Rohit Verma",
      role: "Freelance Designer",
      location: "Delhi, India",
      image: "RV",
      rating: 5,
      quote:
        "Earlier invoicing used to take a lot of time. With BillFast, I can create professional invoices very quickly and my clients are happier.",
      highlight: "Saves a lot of time",
    },
    {
      name: "Aman Gupta",
      role: "Web Developer",
      location: "Bengaluru, India",
      image: "AG",
      rating: 5,
      quote:
        "The interface is clean and very easy to understand. Even clients from outside India find the invoices clear and professional.",
      highlight: "Clean and easy to use",
    },
    {
      name: "Priya Sharma",
      role: "Marketing Consultant",
      location: "Mumbai, India",
      image: "PS",
      rating: 5,
      quote:
        "BillFast understands freelancer needs really well. Shareable invoice links have helped me get payments faster.",
      highlight: "Faster payments",
    },
    {
      name: "Karan Patel",
      role: "Creative Agency Owner",
      location: "Ahmedabad, India",
      image: "KP",
      rating: 5,
      quote:
        "Managing multiple client invoices was confusing earlier. Now everything is organised in one place.",
      highlight: "Great for agencies",
    },
    {
      name: "Neha Kapoor",
      role: "Photographer",
      location: "Pune, India",
      image: "NK",
      rating: 5,
      quote:
        "My invoices now look as professional as my work. Clients definitely notice the difference.",
      highlight: "Professional look",
    },
    {
      name: "Siddharth Jain",
      role: "Software Consultant",
      location: "Jaipur, India",
      image: "SJ",
      rating: 5,
      quote:
        "BillFast makes invoicing simple, clear, and professional for my consulting work every day.",
      highlight: "Simple and clear",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-semibold mb-6">
             Loved by Thousands
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            What Our Users Say
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground">
            Join thousands of freelancers and businesses who trust BillFast
            for their invoicing needs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-card rounded-2xl border border-border p-6 lg:p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300"
            >
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-warning fill-warning" />
                ))}
              </div>

              <p className="text-foreground mb-4 leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                {testimonial.highlight}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;