import { prisma } from "@/lib/prisma";
import RequestStatusDropdown from "@/components/admin/RequestStatusDropdown";
import DeleteAction from "@/components/admin/DeleteAction";

export const dynamic = "force-dynamic";

export default async function AdminRequestsPage() {
  const requests = await prisma.helpRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Help Requests</h1>
      </div>
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium whitespace-nowrap">Request ID</th>
                <th className="p-4 font-medium whitespace-nowrap">Name</th>
                <th className="p-4 font-medium whitespace-nowrap">Location</th>
                <th className="p-4 font-medium whitespace-nowrap">Emergency Type</th>
                <th className="p-4 font-medium whitespace-nowrap">Urgency</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium whitespace-nowrap">Date</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    No help requests found.
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-mono text-muted-foreground">{req.id}</td>
                    <td className="p-4 font-medium">{req.fullName}</td>
                    <td className="p-4 text-sm">{req.village}, {req.district}</td>
                    <td className="p-4 text-sm">{req.emergencyType}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        req.urgency === "CRITICAL" ? "bg-red-500/10 text-red-700 border-red-500/20" :
                        req.urgency === "HIGH" ? "bg-orange-500/10 text-orange-700 border-orange-500/20" :
                        req.urgency === "MEDIUM" ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" :
                        "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                      }`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <RequestStatusDropdown requestId={req.id} currentStatus={req.status} />
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {req.createdAt.toISOString().split("T")[0]}
                    </td>
                    <td className="p-4 text-right">
                      <DeleteAction id={req.id} entity="request" />
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
