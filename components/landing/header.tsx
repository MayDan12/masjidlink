"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

export default function Header() {
  return (
    <header className="border-b bg-background/95 sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/masjidlink.png"
            alt="MasjidLink Logo"
            width={40}
            height={40}
            className="h-10 w-10 "
          />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
            MasjidLink
          </h1>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <div className="flex items-center gap-2 mb-6 mt-2">
              <Image
                src="/masjidlink.png"
                alt="MasjidLink Logo"
                width={40}
                height={40}
                className="h-10 w-10 "
              />
              <h2 className="text-xl font-bold text-primary">MasjidLink</h2>
            </div>
            <nav className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                href="#testimonials"
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Testimonials
              </Link>
              <Link
                href="#pricing"
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/faqs"
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                FAQs
              </Link>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/faqs"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            FAQs
          </Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

{
  /* <header className="border-b bg-background/95 sticky top-0 z-50 w-full  backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Mosque className="h-8 w-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              MasjidLink
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="/faqs"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              FAQs
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header> */
}
