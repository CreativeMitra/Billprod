import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Force dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md group-hover:shadow-lg transition-shadow">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Bill<span className="text-primary">Fast</span>
            </span>
          </Link>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/login?signup=true">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>

          {/* Mobile Right Section */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden py-4 border-t border-border"
          >
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/login?signup=true" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Navbar;
