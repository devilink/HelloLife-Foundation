import { prisma } from "@/lib/prisma";
import VolunteersClientHeader from "./VolunteersClientHeader";
import VolunteerActions from "./VolunteerActions";

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <VolunteersClientHeader />
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium whitespace-nowrap">Name</th>
                <th className="p-4 font-medium whitespace-nowrap">Email</th>
                <th className="p-4 font-medium whitespace-nowrap">Phone</th>
                <th className="p-4 font-medium whitespace-nowrap">District</th>
                <th className="p-4 font-medium whitespace-nowrap">Tasks Done</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No volunteers found.
                  </td>
                </tr>
              ) : (
                volunteers.map((vol) => (
                  <tr key={vol.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{vol.fullName}</td>
                    <td className="p-4 text-sm text-muted-foreground">{vol.email}</td>
                    <td className="p-4 text-sm">{vol.phoneNumber}</td>
                    <td className="p-4 text-sm">{vol.district}</td>
                    <td className="p-4 font-medium text-center">{vol.completedTasks}</td>
                    <td className="p-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        vol.isActive 
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" 
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {vol.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <VolunteerActions volunteer={vol} />
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
