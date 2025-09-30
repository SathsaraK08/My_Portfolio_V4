"use client"

import { Github, Linkedin, Twitter, Mail, Sparkles, ArrowUpRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/30 border-t border-slate-200/50 dark:border-slate-800/50">
      {/* Background Decorations */}
      <div className="absolute top-8 left-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-12 right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl opacity-40" />
      <div className="container mx-auto py-12 md:py-16 px-6 relative z-10">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="space-y-6" variants={itemVariants}>
            <div className="flex items-center space-x-3 group">
              <motion.div
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 shadow-lg shadow-blue-600/25"
                whileHover={{ rotate: 360, scale: 1.05 }}
                transition={{ duration: 0.6 }}
              >
                <Sparkles className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">Portfolio</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xs">Building amazing web experiences with modern technologies. Passionate about creating digital solutions that make a difference.</p>
            <div className="flex space-x-2">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Mail, href: "mailto:contact@portfolio.dev", label: "Email" }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 border border-slate-200 dark:border-slate-700 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-blue-600/25"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5 text-base flex items-center gap-2">
              Quick Links
              <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Skills", href: "/skills" },
                { name: "Projects", href: "/projects" }
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 mr-2 opacity-0 -translate-x-2 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5 text-base flex items-center gap-2">
              More
              <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Education", href: "/education" },
                { name: "Certificates", href: "/certificates" },
                { name: "Contact", href: "/contact" }
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 mr-2 opacity-0 -translate-x-2 -translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-5 text-base flex items-center gap-2">
              Stay Updated
              <span className="h-px flex-1 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-transparent"></span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Get the latest updates and projects directly to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
              <motion.button
                className="px-5 py-2.5 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2 font-medium">
              Made with <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </motion.span> by Sathsara
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:underline underline-offset-4">Privacy Policy</a>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:underline underline-offset-4">Terms of Service</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}