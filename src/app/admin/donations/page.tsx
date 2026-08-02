import { prisma } from "@/lib/prisma";
import DonationsClientHeader from "./DonationsClientHeader";
import VerifyDonationAction from "@/components/admin/VerifyDonationAction";
import Link from "next/link";

export default async function AdminDonationsPage() {
  const [donations, pendingConfirmations] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.donationConfirmation.findMany({ 
      where: { status: "PENDING" },
      orderBy: { createdAt: 'desc' } 
    })
  ]);

  return (
    <div className="space-y-10">
      <DonationsClientHeader />
      
      {pendingConfirmations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-amber-500">Pending Verifications</h2>
          <div className="bg-card border border-amber-500/20 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-amber-500/5 text-amber-900/60 dark:text-amber-500/60 text-sm border-b border-amber-500/20">
                    <th className="p-4 font-medium whitespace-nowrap">Donor Name</th>
                    <th className="p-4 font-medium whitespace-nowrap">Amount</th>
                    <th className="p-4 font-medium whitespace-nowrap">Date</th>
                    <th className="p-4 font-medium whitespace-nowrap">Receipt/Screenshot</th>
                    <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-500/10">
                  {pendingConfirmations.map((conf) => (
                    <tr key={conf.id} className="hover:bg-amber-500/5 transition-colors">
                      <td className="p-4 font-medium">
                        {conf.anonymous ? "Anonymous" : conf.fullName}
                      </td>
                      <td className="p-4 font-bold text-amber-600 dark:text-amber-400">
                        ₹{conf.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {conf.paymentDate.toISOString().split("T")[0]}
                      </td>
                      <td className="p-4 text-sm">
                        <Link href={conf.screenshotUrl} target="_blank" className="text-primary hover:underline">
                          View Receipt
                        </Link>
                      </td>
                      <td className="p-4 flex justify-end">
                        <VerifyDonationAction confirmationId={conf.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Official Ledger</h2>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium whitespace-nowrap">ID</th>
                <th className="p-4 font-medium whitespace-nowrap">Donor Name</th>
                <th className="p-4 font-medium whitespace-nowrap">Amount</th>
                <th className="p-4 font-medium whitespace-nowrap">Date</th>
                <th className="p-4 font-medium whitespace-nowrap">Payment Method</th>
                <th className="p-4 font-medium whitespace-nowrap">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No donations found.
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-mono text-muted-foreground">{donation.id}</td>
                    <td className="p-4 font-medium">
                      {donation.anonymous ? "Anonymous" : donation.donorName}
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{donation.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {donation.paymentDate.toISOString().split("T")[0]}
                    </td>
                    <td className="p-4 text-sm">{donation.paymentMethod}</td>
                    <td className="p-4 text-sm font-mono text-muted-foreground">{donation.transactionId || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}
