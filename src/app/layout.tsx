import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageTransitionProvider } from "@/components/page-transition-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio - Full Stack Developer",
  description: "Professional portfolio showcasing my skills, projects, and experience as a full stack developer.",
  keywords: "developer, portfolio, full stack, web development, react, next.js",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Portfolio - Full Stack Developer",
    description: "Professional portfolio showcasing my skills, projects, and experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <PageTransitionProvider>
              <main className="flex-1">{children}</main>
            </PageTransitionProvider>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
