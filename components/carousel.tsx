import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "./ui/button";
import Link from "next/link";
import { ChurchIcon as Mosque, Calendar, Bell, Heart } from "lucide-react";

const dashboardCards = [
  {
    icon: <Mosque size={24} />,
    title: "Masjid Profiles",
    description: "Discover and connect with masjids in your area",
    link: "/dashboard/masjids",
    buttonText: "Explore Masjids",
  },
  {
    icon: <Bell size={24} />,
    title: "Azan System",
    description: "Customize your azan notifications and preferences",
    link: "/dashboard/azan-settings",
    buttonText: "Azan Settings",
  },
  {
    icon: <Calendar size={24} />,
    title: "Events",
    description: "Stay updated with community events and gatherings",
    link: "/dashboard/events",
    buttonText: "View Events",
  },
  {
    icon: <Heart size={24} />,
    title: "Donations",
    description: "Support your local masjid with secure donations",
    link: "/dashboard/donate",
    buttonText: "Donate Now",
  },
];

export function CarouselDemo() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-xs"
    >
      <CarouselContent className="-ml-2 md:-ml-4 w-56">
        {dashboardCards.map((card, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="items-center justify-center p-3">
                  <CardHeader className="space-y-1 p-3 md:p-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                      {card.icon}
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link href={card.link}>{card.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
