import { Skeleton } from "@/components/ui/skeleton";

const heroGridColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
  "bg-chart-8",
  "bg-chart-9",
  "bg-chart-10",
  "bg-chart-1",
  "bg-chart-5",
];

const techPillColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
  "bg-chart-6",
  "bg-chart-7",
  "bg-chart-8",
];

const experienceAccents = ["bg-chart-2", "bg-chart-6", "bg-chart-8"];

const projectCards = [
  { thumb: "bg-chart-2", tags: ["bg-chart-1", "bg-chart-3", "bg-chart-5"] },
  { thumb: "bg-chart-5", tags: ["bg-chart-2", "bg-chart-8", "bg-chart-4"] },
  { thumb: "bg-chart-8", tags: ["bg-chart-6", "bg-chart-9", "bg-chart-3"] },
  { thumb: "bg-chart-9", tags: ["bg-chart-1", "bg-chart-7", "bg-chart-10"] },
  { thumb: "bg-chart-6", tags: ["bg-chart-2", "bg-chart-5", "bg-chart-8"] },
  { thumb: "bg-chart-3", tags: ["bg-chart-4", "bg-chart-9", "bg-chart-1"] },
];

const reviewAvatars = [
  "bg-chart-1",
  "bg-chart-5",
  "bg-chart-8",
  "bg-chart-2",
  "bg-chart-9",
  "bg-chart-6",
];

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 w-full space-y-4">
            <Skeleton className="h-12 md:h-16 w-3/4 bg-main" />
            <Skeleton className="h-8 md:h-10 w-1/2 bg-chart-2" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-5 w-full max-w-2xl" />
              <Skeleton className="h-5 w-5/6 max-w-xl" />
              <Skeleton className="h-5 w-4/6 max-w-lg" />
            </div>
            <Skeleton className="h-12 w-36 mt-4 bg-chart-3" />
          </div>
          <div className="flex-1 w-full min-h-96 border-4 border-border rounded-lg bg-main p-6 flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4 flex-1">
              {heroGridColors.map((color, i) => (
                <Skeleton
                  key={`hero-cell-${i}`}
                  className={`w-full aspect-square ${color}`}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-11 w-36 bg-secondary-background" />
            </div>
          </div>
        </div>
      </section>

      {/* Tech skills skeleton */}
      <section className="py-12 overflow-hidden">
        <div className="flex gap-4 px-6 md:px-12">
          {techPillColors.map((color, i) => (
            <Skeleton
              key={`skill-${i}`}
              className={`h-12 w-28 shrink-0 rounded-full ${color}`}
            />
          ))}
        </div>
      </section>

      {/* Experience skeleton */}
      <section className="px-6 md:px-12 py-16">
        <Skeleton className="h-10 w-48 mx-auto mb-8 bg-chart-5" />
        <div className="space-y-6 max-w-4xl mx-auto">
          {experienceAccents.map((accent, i) => (
            <div
              key={`experience-${i}`}
              className="flex gap-4 border-4 border-border rounded-lg p-6 bg-secondary-background"
            >
              <Skeleton className={`size-12 shrink-0 rounded-base ${accent}`} />
              <div className="flex-1 space-y-3">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-5 w-36" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects skeleton */}
      <section className="px-6 md:px-12 py-16">
        <Skeleton className="h-10 w-40 mx-auto mb-8 bg-chart-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectCards.map((project, i) => (
            <div
              key={`project-${i}`}
              className="border-4 border-border rounded-lg overflow-hidden bg-secondary-background"
            >
              <Skeleton className={`w-full aspect-video ${project.thumb}`} />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex gap-2 pt-2">
                  {project.tags.map((tag, j) => (
                    <Skeleton
                      key={`project-${i}-tag-${j}`}
                      className={`h-6 w-16 rounded-full ${tag}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ skeleton */}
      <section className="px-6 md:px-12 py-16 md:py-24 bg-chart-4 border-y-4 border-border">
        <Skeleton className="h-9 w-72 mb-10 bg-secondary-background" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`faq-${i}`}
              className={`flex gap-4 rounded-base border-2 border-border p-6 ${
                i === 1 || i === 2 ? "bg-chart-3" : "bg-secondary-background"
              }`}
            >
              <Skeleton className="size-12 shrink-0 rounded-base bg-background" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3 bg-background" />
                <Skeleton className="h-4 w-full bg-background" />
                <Skeleton className="h-4 w-4/6 bg-background" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews skeleton */}
      <section className="px-6 md:px-12 py-16 md:py-24">
        <Skeleton className="h-9 w-32 mb-10 bg-chart-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviewAvatars.map((avatar, i) => (
            <div
              key={`review-${i}`}
              className="border-2 border-border rounded-base p-5 bg-secondary-background space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <Skeleton className={`size-10 rounded-base ${avatar}`} />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
