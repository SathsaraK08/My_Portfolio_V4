import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 md:py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Portfolio</h3>
            <p className="text-sm text-muted-foreground">
              Building amazing web experiences with modern technologies.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/education" className="text-muted-foreground hover:text-primary">
                  Education
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="text-muted-foreground hover:text-primary">
                  Certificates
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Resume
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Get in Touch</h4>
            <p className="text-sm text-muted-foreground">
              Have a project in mind? Let's discuss how we can work together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Send a message
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Portfolio. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}