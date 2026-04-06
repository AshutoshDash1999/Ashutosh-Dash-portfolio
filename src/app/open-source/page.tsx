import PageLayout from "@/components/layout/page-layout";
import data from "@/lib/data.json";
import { OpenSourceContent } from "./_components/open-source-content";

type OpenSourceContribution = {
  repo: string;
  org: string;
  url: string;
  description: string;
  technologies: string[];
  issueUrl: string;
};

export default function OpenSourcePage() {
  const contributions: OpenSourceContribution[] =
    (data as { openSourceContributions?: OpenSourceContribution[] })
      .openSourceContributions ?? [];

  return (
    <PageLayout>
      <OpenSourceContent contributions={contributions} />
    </PageLayout>
  );
}
