import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  let totalDonations = { _sum: { amount: 0 }, _count: 0 };
  let totalExpenses = { _sum: { amount: 0 }, _count: 0 };
  let totalVolunteers = 0;
  let activeProjects = 0;

  try {
    const res = await Promise.all([
      prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
      prisma.expense.aggregate({ _sum: { amount: true }, _count: true }),
      prisma.volunteer.count({ where: { isActive: true } }),
      prisma.project.count({ where: { status: 'ACTIVE' } })
    ]);
    totalDonations = res[0] as any;
    totalExpenses = res[1] as any;
    totalVolunteers = res[2];
    activeProjects = res[3];
  } catch (error) {
    console.error("Admin reports DB error:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Donations Received</p>
          <h2 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            ₹{(totalDonations._sum.amount || 0).toLocaleString()}
          </h2>
          <p className="text-xs text-muted-foreground mt-2">{totalDonations._count} total donations</p>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Total Funds Disbursed</p>
          <h2 className="text-3xl font-bold text-rose-600 dark:text-rose-400">
            ₹{(totalExpenses._sum.amount || 0).toLocaleString()}
          </h2>
          <p className="text-xs text-muted-foreground mt-2">{totalExpenses._count} total expenses</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Active Volunteers</p>
          <h2 className="text-3xl font-bold text-primary">
            {totalVolunteers}
          </h2>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-1">Active Projects</p>
          <h2 className="text-3xl font-bold text-primary">
            {activeProjects}
          </h2>
        </div>
      </div>
    </div>
  );
}
