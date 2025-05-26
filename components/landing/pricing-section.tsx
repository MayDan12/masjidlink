import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PricingSection() {
  const pricingPlans = [
    {
      name: "Free",
      description: "Essential features for community members",
      price: "$0",
      billing: "forever",
      features: [
        "Prayer time notifications",
        "Masjid discovery",
        "View community events",
        "Basic profile",
        "Up to 3 masjid follows",
      ],
      cta: "Get Started",
      href: "/register",
      mostPopular: false,
    },
    {
      name: "Community",
      description: "For active community members",
      price: "$5",
      billing: "per month",
      features: [
        "All Free features",
        "Unlimited masjid follows",
        "Event RSVP",
        "Live event notifications",
        "Message board access",
        "Enhanced profile",
      ],
      cta: "Start Trial",
      href: "/register?plan=community",
      mostPopular: true,
    },
    // {
    //   name: "Masjid",
    //   description: "For imams and masjid administrators",
    //   price: "$25",
    //   billing: "per month",
    //   features: [
    //     "All Community features",
    //     "Masjid profile management",
    //     "Prayer time management",
    //     "Event creation & management",
    //     "Donation collection & tracking",
    //     "Announcement broadcasts",
    //     "Community engagement tools",
    //   ],
    //   cta: "Contact Sales",
    //   href: "/contact-sales",
    //   mostPopular: false,
    // },
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container px-4 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col ${
                plan.mostPopular ? "border-primary shadow-lg" : "border"
              }`}
            >
              <CardHeader>
                {plan.mostPopular && (
                  <Badge className="w-fit mb-2">Most Popular</Badge>
                )}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-2 text-muted-foreground">
                    {plan.billing}
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.mostPopular ? "" : "variant-outline"
                  }`}
                  variant={plan.mostPopular ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom solution?{" "}
            <Link
              href="/contact"
              className="text-primary font-medium hover:underline"
            >
              Contact our team
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
