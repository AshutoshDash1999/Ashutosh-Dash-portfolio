import PageLayout from "@/components/layout/page-layout";
import { ClientWorkContent } from "./_components/client-work-content";
import data from "@/lib/data.json";

export default function ClientWorkPage() {
    const clientWork = data.clientWork ?? [];

    return (
        <PageLayout>
            <ClientWorkContent clientWork={clientWork} />
        </PageLayout>
    );
}
