import data from "@/lib/data.json";
import type { Metadata } from "next";

const { personal } = data;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ashutoshdash.in";

export const metadata: Metadata = {
  title: "Open Source Contributions",
  description: `Open source contributions by ${personal.name}. Projects and communities I've contributed to, including Mantine, Refine, and more.`,
  openGraph: {
    title: `Open Source Contributions | ${personal.name}`,
    description: `Open source contributions by ${personal.name}. Projects and communities I've contributed to.`,
    url: `${siteUrl}/open-source`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Open Source Contributions | ${personal.name}`,
    description: `Open source contributions by ${personal.name}.`,
  },
  alternates: {
    canonical: `${siteUrl}/open-source`,
  },
};

export default function OpenSourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
