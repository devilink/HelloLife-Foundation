"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Heart, CreditCard, FolderOpen, AlertCircle, Users, FileText, Menu, X, ShieldCheck, Settings, Image } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Donations", href: "/admin/donations", icon: Heart },
    { name: "Expenses", href: "/admin/expenses", icon: CreditCard },
    { name: "Projects", href: "/admin/projects", icon: FolderOpen },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Help Requests", href: "/admin/requests", icon: AlertCircle },
    { name: "Volunteers", href: "/admin/volunteers", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex justify-between items-center z-50">
        <Link href="/admin" className="flex items-center gap-2 text-primary font-bold">
          <ShieldCheck className="h-6 w-6" /> Admin Portal
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3 text-primary font-bold text-xl overflow-hidden whitespace-nowrap">
            <ShieldCheck className="h-8 w-8 shrink-0" />
            <span className={cn("transition-opacity duration-300", !sidebarOpen && "md:opacity-0")}>Admin Portal</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              prefetch={false}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group overflow-hidden whitespace-nowrap",
                pathname === item.href 
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              <span className={cn("transition-opacity duration-300", !sidebarOpen && "md:opacity-0")}>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border flex justify-center">
          <UserButton showName={sidebarOpen} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="hidden md:flex h-20 bg-background/80 backdrop-blur-md border-b border-border items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Menu className="h-5 w-5 text-muted-foreground" />
            </button>
            <h2 className="font-semibold text-lg text-foreground">
              {menuItems.find(i => i.href === pathname)?.name || "Admin"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
