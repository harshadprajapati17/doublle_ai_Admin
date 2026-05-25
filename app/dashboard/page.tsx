import { FluidDashboardLayout } from "@/components/fluid-dashboard-layout";
import { ProgramsDashboardSection } from "@/components/programs/programs-dashboard-section";

const PROGRAMS_PAGE = {
  title: "Referral programs",
  description:
    "Referrer rewards and referee benefits for your referral program.",
} as const;

export default function DashboardPage() {
  return (
    <FluidDashboardLayout {...PROGRAMS_PAGE}>
      <ProgramsDashboardSection />
    </FluidDashboardLayout>
  );
}
