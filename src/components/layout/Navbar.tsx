"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar({ navSettings = {} }: { navSettings?: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  let navLinks = [
    { name: "Home", href: "/", settingKey: "navHome" },
    { name: "Projects", href: "/projects", settingKey: "navProjects" },
    { name: "Impact", href: "/gallery", settingKey: "navImpact" },
    { name: "Transparency", href: "/transparency", settingKey: "navTransparency" },
    { name: "Need Help", href: "/request-help", settingKey: "navNeedHelp" },
    { name: "Volunteer", href: "/volunteer", settingKey: "navVolunteer" },
  ];

  // Filter links based on admin settings (default to true if not set)
  navLinks = navLinks.filter(link => navSettings[link.settingKey] !== "false");

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logoss.png" alt="Hello Life Foundation Logo" width={48} height={48} className="h-10 w-auto" />
            <span className="font-extrabold text-xl tracking-tight text-gray-900">Hellolife Foundation</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-emerald-600",
                    pathname === link.href ? "text-emerald-600 font-semibold" : "text-gray-600"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                prefetch={false}
                className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
              >
                Admin
              </Link>
              <Link
                href="/donate"
                className="px-6 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/25"
              >
                Donate Now
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base font-medium",
                  pathname === link.href
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-6">
              <Link
                href="/admin"
                prefetch={false}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center rounded-2xl border border-gray-200 text-gray-700 font-medium"
              >
                Admin Panel
              </Link>
              <Link
                href="/donate"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-center rounded-2xl bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-600/25"
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
