import { prisma } from "@/lib/prisma";
import ProjectsClientHeader from "./ProjectsClientHeader";
import ProjectStatusToggle from "@/components/admin/ProjectStatusToggle";
import DeleteAction from "@/components/admin/DeleteAction";
import EditProjectAction from "@/components/admin/EditProjectAction";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { images: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <ProjectsClientHeader />
      
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                <th className="p-4 font-medium whitespace-nowrap">Name</th>
                <th className="p-4 font-medium whitespace-nowrap">Location</th>
                <th className="p-4 font-medium whitespace-nowrap">Goal</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium whitespace-nowrap">Images</th>
                <th className="p-4 font-medium whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium">{project.name}</td>
                    <td className="p-4 text-sm">{project.location || "-"}</td>
                    <td className="p-4 font-bold text-foreground">
                      ₹{project.goal.toLocaleString()}
                    </td>
                    <td className="p-4 text-sm">
                      <ProjectStatusToggle projectId={project.id} currentStatus={project.status} />
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {project._count.images} images
                    </td>
                    <td className="p-4 text-right flex justify-end gap-2">
                      <EditProjectAction project={project} />
                      <DeleteAction id={project.id} entity="project" />
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
