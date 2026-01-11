export default function Footer() {
  return (
    <footer className="border-t-4 border-border bg-chart-4 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center text-foreground">
          <p>
            © {new Date().getFullYear()} Ashutosh Dash. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
