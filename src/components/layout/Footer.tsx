import Link from "next/link";
import Image from "next/image";
import { MapPin, Facebook, Instagram, AtSign } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logoss.png" alt="Hello Life Foundation Logo" width={48} height={48} className="h-10 w-auto" />
              <span className="font-extrabold text-xl tracking-tight text-white">Hellolife Foundation</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              A transparent platform dedicated to providing flood relief and humanitarian support to those in need. Every contribution counts.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-white mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">

              <li>
                <Link href="/projects" className="hover:text-white transition-colors">Active Projects</Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-white transition-colors">Financial Dashboard</Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white transition-colors">Become a Volunteer</Link>
              </li>
              <li>
                <Link href="/request-help" className="hover:text-white transition-colors">Request Help</Link>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="font-semibold text-lg text-white mb-6">Follow Us</h3>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/share/1RUCgZx8Gn/" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/hellolifefoundation?igsh=MXNtYmVva3lhbXNiZw==" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-[#E1306C] hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.threads.com/@hellolifefoundation" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-black hover:text-white transition-colors">
                <AtSign className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Hello Life Foundation. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
