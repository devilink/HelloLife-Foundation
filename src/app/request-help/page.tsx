import RequestForm from "@/components/help/RequestForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Help | Hello Life Foundation",
  description: "Request emergency flood relief, medical aid, or rescue operations.",
};

export default function RequestHelpPage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <RequestForm />
    </div>
  );
}
