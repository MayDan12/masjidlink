import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChurchIcon as Mosque,
  Users,
  Clock,
  Calendar,
  Bell,
  Heart,
  UserCog,
} from "lucide-react";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { TestimonialsSection } from "@/components/landing/testimonials";
import { PricingSection } from "@/components/landing/pricing-section";
import { FooterSection } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Role-Based Sections */}
        <section id="roles" className="py-20 bg-muted/30">
          <div className="container px-4 md:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Tailored for Every Role
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                MasjidLink serves the entire Muslim community with dedicated
                features for every role
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Regular Users */}
              <div className="bg-background rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold">For Community Members</h3>
                <p className="mt-2 text-muted-foreground">
                  Access prayer times, discover local masjids, receive
                  notifications for events and more
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    <span>Accurate prayer times</span>
                  </li>
                  <li className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    <span>Azan notifications</span>
                  </li>
                  <li className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <span>Community events</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/dashboard">User Dashboard</Link>
                </Button>
              </div>

              {/* Imams */}
              <div className="bg-background rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <UserCog size={24} />
                </div>
                <h3 className="text-xl font-bold">
                  For Imams & Masjid Leaders
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Powerful tools to manage your masjid, engage with your
                  community and handle donations
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <Mosque className="h-5 w-5 mr-2 text-primary" />
                    <span>Manage masjid profile</span>
                  </li>
                  <li className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    <span>Publish announcements</span>
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-primary" />
                    <span>Donation management</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/imam">Imam Dashboard</Link>
                </Button>
              </div>

              {/* Admins */}
              {/* <div className="bg-background rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-xl font-bold">For Administrators</h3>
                <p className="mt-2 text-muted-foreground">
                  Complete oversight of the platform, verification of masjids
                  and moderation tools
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                    <span>Verify masjid accounts</span>
                  </li>
                  <li className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    <span>Manage user accounts</span>
                  </li>
                  <li className="flex items-center">
                    <Mosque className="h-5 w-5 mr-2 text-primary" />
                    <span>Platform oversight</span>
                  </li>
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/admin-dashboard">Admin Dashboard</Link>
                </Button>
              </div> */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeatureSection />

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Pricing */}
        <PricingSection />

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Join the MasjidLink Community
            </h2>
            <p className="mt-4 text-xl max-w-3xl mx-auto opacity-90">
              Connect with your local masjid, strengthen community bonds, and
              enhance your spiritual journey
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="font-bold"
                asChild
              >
                <Link href="/register">Create Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground font-bold"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
