import { ReactNode } from "react";

export default function Marquee({ items }: { items: ReactNode[] }) {
  return (
    <div className="relative flex w-full overflow-x-hidden border-b-4 border-t-4 border-border bg-secondary-background text-foreground font-base">
      <div className="animate-marquee whitespace-nowrap py-12">
        {items.map((item, index) => {
          return (
            <span
              key={index}
              className="mx-4 text-4xl inline-flex items-center gap-2"
            >
              {item}
            </span>
          );
        })}
      </div>

      <div
        className="absolute top-0 animate-marquee2 whitespace-nowrap py-12"
        aria-hidden="true"
      >
        {items.map((item, index) => {
          return (
            <span
              key={index}
              className="mx-4 text-4xl inline-flex items-center gap-2"
            >
              {item}
            </span>
          );
        })}
      </div>

      {/* must have both of these in order to work */}
    </div>
  );
}
