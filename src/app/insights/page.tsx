import PageLayout from "@/components/layout/page-layout";
import { InsightsContent } from "./_components/insights-content";
import { InsightsPeriodProvider } from "./_components/insights-period-context";

export default function InsightsPage() {
  return (
    <PageLayout>
      <InsightsPeriodProvider>
        <InsightsContent />
      </InsightsPeriodProvider>
    </PageLayout>
  );
}
