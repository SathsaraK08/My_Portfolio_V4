"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", isRoute: true },
  { name: "About", href: "/about", isRoute: true },
  { name: "Skills", href: "/skills", isRoute: true },
  { name: "Projects", href: "/projects", isRoute: true },
  { name: "Education", href: "/education", isRoute: true },
  { name: "Certificates", href: "/certificates", isRoute: true },
  { name: "Contact", href: "/contact", isRoute: true },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/5 dark:shadow-slate-900/50"
          : "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-800/20"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-6">
        <motion.div
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 shadow-lg shadow-blue-600/25"
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-blue-900 transition-all duration-300">
              Portfolio
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href || (pathname === "/" && item.href === "/");
            return (
              <Link key={item.name} href={item.href} passHref legacyBehavior>
                <motion.a
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-blue-500/15 dark:from-blue-400/15 dark:via-purple-400/15 dark:to-blue-400/15 rounded-xl -z-10 shadow-inner"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.a>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-4 space-y-2">
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || (pathname === "/" && item.href === "/");
                return (
                  <Link key={item.name} href={item.href} passHref legacyBehavior>
                    <motion.a
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-blue-500/15 dark:from-blue-400/15 dark:via-purple-400/15 dark:to-blue-400/15 text-blue-600 dark:text-blue-400 font-semibold shadow-inner"
                          : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      {item.name}
                    </motion.a>
                  </Link>
                );
              })}
              <div className="pt-2">
                <div className="flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}