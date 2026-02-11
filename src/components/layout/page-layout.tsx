import Navbar from "@/components/navbar";
import Footer from "@/components/sections/footer";
import SocialLinks from "@/components/sections/social-links";

export default function PageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="px-6 md:px-12 py-10">
                {children}
            </section>
            <SocialLinks />
            <Footer />
        </main>
    );
}
