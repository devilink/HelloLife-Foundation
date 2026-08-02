import TransparencyDashboard from "@/components/transparency/TransparencyDashboard";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Financial Dashboard | Hello Life Foundation",
  description: "View our financial summary and searchable expense ledger. 100% transparent operations.",
};

export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  let expenses: any[] = [];
  let dbSettings: any[] = [];
  try {
    const res = await Promise.all([
      prisma.expense.findMany({
        orderBy: { date: "desc" }
      }),
      prisma.setting.findMany(),
    ]);
    expenses = res[0];
    dbSettings = res[1];
  } catch (error) {
    console.error("Transparency page DB query error:", error);
  }

  const settingsMap = dbSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  const stats = {
    totalRaised: settingsMap.totalRaised || "0",
    totalExpenses: settingsMap.totalExpenses || "0",
    remainingBalance: settingsMap.remainingBalance || "0"
  };

  const formattedExpenses = expenses.map(exp => ({
    id: exp.id,
    title: exp.title,
    category: exp.category,
    amount: exp.amount,
    date: exp.date.toISOString().split("T")[0],
    district: exp.location || "Various",
    approvedBy: exp.approvedBy
  }));

  return (
    <div className="min-h-screen bg-muted/20">
      <TransparencyDashboard initialExpenses={formattedExpenses} stats={stats} />
    </div>
  );
}
