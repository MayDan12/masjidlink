import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative py-10 md:pb-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 text-primary mb-5">
            <Image
              src="/masjidlink.png"
              alt="MasjidLink Logo"
              width={70}
              height={70}
              className="h-16 w-16 "
            />
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl">
            MasjidLink
          </h1>

          <p className="mt-4 text-xl sm:text-2xl text-muted-foreground max-w-3xl">
            Your all-in-one platform connecting Muslims with their local masjids
            and strengthening Ummah bonds
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-4">
            <Button size="lg" className="font-bold text-base" asChild>
              <Link href="/register">Get Started for Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="font-bold text-base"
              asChild
            >
              <Link href="#features">Learn More</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">
              Trusted by masjids worldwide
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-6 opacity-75">
              {/* Placeholder for masjid trust logos */}
              <div className="h-8 w-28 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Masjid Al-Noor
              </div>
              <div className="h-8 w-28 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Islamic Center
              </div>
              <div className="h-8 w-28 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Masjid Al-Rahma
              </div>
              <div className="h-8 w-28 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">
                Grand Mosque
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-10 rounded-xl overflow-hidden border shadow-lg">
            <Image
              src="/darkdashboard.png"
              alt="MasjidLink Dashboard Preview"
              height={600}
              width={1200}
              priority
              className="w-full h-full border-primary border-4 "
            />
          </div>
        </div>
      </div>
    </section>
  );
}
