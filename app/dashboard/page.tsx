import { PageHeader } from "@/components/ui/dashboard";
import { ProgramsDashboardSection } from "@/components/programs/programs-dashboard-section";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Referral programs"
        description="Referrer rewards and referee benefits for your referral program."
      />
      <ProgramsDashboardSection />
    </>
  );
}
