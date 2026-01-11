import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import data from "@/lib/data.json";

export default function Reviews() {
  const { reviews } = data;

  return (
    <section
      id="reviews"
      className="container mx-auto px-4 py-16 md:py-24"
    >
      <h2 className="text-3xl md:text-4xl font-heading mb-8 md:mb-12">
        Reviews
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl">{review.clientName}</CardTitle>
              <div className="text-sm text-foreground">{review.role}</div>
              {review.rating && (
                <div className="text-main">
                  {"★".repeat(review.rating)}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-foreground italic">"{review.review}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
