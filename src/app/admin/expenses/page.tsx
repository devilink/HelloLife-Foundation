import { prisma } from "@/lib/prisma";
import ExpensesClientHeader from "./ExpensesClientHeader";
import DeleteAction from "@/components/admin/DeleteAction";
import Link from "next/link";

export default async function AdminExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { date: 'desc' }
  });

  return (
    <div className="space-y-6">
      <ExpensesClientHeader />
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium whitespace-nowrap">ID</th>
                <th className="p-4 font-medium whitespace-nowrap">Title</th>
                <th className="p-4 font-medium whitespace-nowrap">Category</th>
                <th className="p-4 font-medium whitespace-nowrap">Amount</th>
                <th className="p-4 font-medium whitespace-nowrap">Date</th>
                <th className="p-4 font-medium whitespace-nowrap">Location</th>
                <th className="p-4 font-medium whitespace-nowrap">Receipt</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No expenses found.
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-mono text-muted-foreground">{expense.id}</td>
                    <td className="p-4 font-medium">{expense.title}</td>
                    <td className="p-4 text-sm">
                      <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-rose-600 dark:text-rose-400">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {expense.date.toISOString().split("T")[0]}
                    </td>
                    <td className="p-4 text-sm">{expense.location || "-"}</td>
                    <td className="p-4 text-sm">
                      {expense.receiptUrl ? (
                        <Link href={expense.receiptUrl} target="_blank" className="text-primary hover:underline">
                          View
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <DeleteAction id={expense.id} entity="expense" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
