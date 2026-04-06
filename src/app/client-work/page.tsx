import PageLayout from "@/components/layout/page-layout";
import data from "@/lib/data.json";
import { ClientWorkContent } from "./_components/client-work-content";

export default function ClientWorkPage() {
  const clientWork = data.clientWork ?? [];

  return (
    <PageLayout>
      <ClientWorkContent clientWork={clientWork} />
    </PageLayout>
  );
}
