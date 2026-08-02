import DonateClient from "@/components/donate/DonateClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Our Mission | Hello Life Foundation",
  description: "Donate to our flood relief efforts via UPI or Bank Transfer. Help us rebuild communities.",
};

export default function DonatePage() {
  return <DonateClient />;
}
