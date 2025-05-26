import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "lucide-react";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "MasjidLink has transformed how our community stays connected. The prayer time notifications and event management features have significantly increased attendance at our masjid.",
      author: "Imam Abdullah",
      role: "Imam at Masjid Al-Noor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "As a newcomer to the area, MasjidLink helped me discover my local masjid and connect with the Muslim community. The app is intuitive and has all the features I need.",
      author: "Fatima Rahman",
      role: "Community Member",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "Managing donations through MasjidLink has streamlined our financial processes and increased transparency. Our community members appreciate the ease of contributing.",
      author: "Omar Khan",
      role: "Treasurer at Islamic Center",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            What Our Users Say
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Trusted by imams, masjid administrators, and community members
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-6">
                <QuoteIcon className="h-8 w-8 text-primary/40 mb-4" />
                <p className="mb-6 text-muted-foreground">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                    />
                    <AvatarFallback>
                      {testimonial.author.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
