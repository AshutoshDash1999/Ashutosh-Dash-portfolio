export default function Footer() {
    return (
        <footer className="border-t-4 border-border py-8 md:py-8">
            <div className="px-6 md:px-12">
                <div className="text-center text-foreground">
                    <p className="text-base md:text-base">
                        © {new Date().getFullYear()} Ashutosh Dash. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
