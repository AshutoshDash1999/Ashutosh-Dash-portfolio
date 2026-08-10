import type { Metadata } from "next";
import data from "@/lib/data.json";

const { personal } = data;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ashutoshdash.in";

export const metadata: Metadata = {
  title: "Collaborations",
  description: `Collaboration projects and case studies by ${personal.name}. Web applications, mobile apps, and dashboards built for LearningPad, Badho, BookingJini, and more.`,
  openGraph: {
    title: `Collaborations | ${personal.name}`,
    description: `Collaboration projects and case studies by ${personal.name}. Web and mobile applications.`,
    url: `${siteUrl}/collaborations`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Collaborations | ${personal.name}`,
    description: `Collaboration projects by ${personal.name}.`,
  },
  alternates: {
    canonical: `${siteUrl}/collaborations`,
  },
};

export default function CollaborationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
