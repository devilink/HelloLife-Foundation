import { Metadata } from "next";
import VolunteerForm from "@/components/volunteer/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer Registration | Hello Life Foundation",
  description: "Join Hello Life Foundation as a volunteer and help us make a difference in communities affected by floods.",
};

export default function VolunteerPage() {
  return (
    <main className="min-h-screen bg-muted/20">
      <div className="max-w-4xl mx-auto py-16 px-4">
        <VolunteerForm />
      </div>
    </main>
  );
}
