import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminLayoutClient from "./AdminLayoutClient";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  
  // If not logged in, clerk middleware should have caught this, but just in case:
  if (!user) {
    redirect("/sign-in");
  }

  // Get primary email
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  const allowedEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

  const isAllowed = primaryEmail && allowedEmails.includes(primaryEmail.toLowerCase());

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-sm border border-border text-center">
          <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            Your account ({primaryEmail}) is not authorized to access the Admin Portal. Please sign in with an authorized account or contact the administrator.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}
