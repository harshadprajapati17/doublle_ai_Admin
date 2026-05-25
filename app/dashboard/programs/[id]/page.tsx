import { FluidDashboardLayout } from "@/components/fluid-dashboard-layout";
import { ProgramDetailLoader } from "@/components/programs/program-detail-loader";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <FluidDashboardLayout
      title="Referral programs"
      description="Referrer rewards and referee benefits for your referral program."
    >
      <ProgramDetailLoader programId={id} />
    </FluidDashboardLayout>
  );
}
