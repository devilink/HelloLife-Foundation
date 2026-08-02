import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const dbSettings = await prisma.setting.findMany();
  const settingsMap = dbSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Settings</h1>
      </div>
      
      <p className="text-muted-foreground">
        Customize the statistics displayed on the Admin Dashboard and the public Transparency page.
        These manual overrides allow you to reflect offline operations without needing to create hundreds of individual dummy records.
      </p>

      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
