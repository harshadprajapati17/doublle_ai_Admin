import { ProgramDetailLoader } from "@/components/programs/program-detail-loader";
import { PageHeader } from "@/components/ui/dashboard";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <PageHeader
        title="Referral programs"
        description="Referrer rewards and referee benefits for your referral program."
      />
      <ProgramDetailLoader programId={id} />
    </>
  );
}
