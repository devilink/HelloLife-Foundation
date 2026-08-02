import ConfirmForm from "@/components/donate/ConfirmForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Donation | Hello Life Foundation",
  description: "Submit your payment details for manual verification by our team.",
};

export default function ConfirmDonationPage() {
  return (
    <div className="min-h-screen bg-muted/20 py-16 px-4">
      <ConfirmForm />
    </div>
  );
}
