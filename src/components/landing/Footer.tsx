import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Bill<span className="text-primary">Fast</span>
            </span>
          </Link>

          {/* Legal links */}
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link
              to="/privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 BillFast. Made in India 🇮🇳
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;