import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "What is MasjidLink?",
    a: "MasjidLink connects Muslims with their local masjids. It helps community members discover masjids, view prayer times, follow announcements and events, and support masjids through donations. Imams and masjid leaders can manage their masjid profile, prayer times, events and donation campaigns.",
  },
  {
    q: "How do I get started?",
    a: (
      <>
        Create an account and sign in. Community members can explore the{" "}
        <Link href="/dashboard" className="underline">
          Dashboard
        </Link>{" "}
        to discover masjids and customize azan settings. Imams and masjid
        leaders can use the{" "}
        <Link href="/imam" className="underline">
          Imam Dashboard
        </Link>{" "}
        to set up and manage their masjid profile.
      </>
    ),
  },
  {
    q: "Is MasjidLink free?",
    a: "Yes, you can start for free. Some advanced features may be offered with paid plans in the future. See the pricing section on the home page for more details.",
  },
  {
    q: "How do I find and follow my local masjid?",
    a: (
      <>
        Visit{" "}
        <Link href="/dashboard/masjids" className="underline">
          Masjid Profiles
        </Link>{" "}
        to search and browse nearby masjids. Open a masjid to view details and
        choose to follow it for updates and events.
      </>
    ),
  },
  {
    q: "How do azan notifications work?",
    a: (
      <>
        Go to{" "}
        <Link href="/dashboard/azan-settings" className="underline">
          Azan Settings
        </Link>{" "}
        to configure reminders based on your location and preferred calculation
        methods. Ensure your browser allows notifications and location access.
      </>
    ),
  },
  {
    q: "I am an imam or masjid leader. How do I manage our masjid?",
    a: (
      <>
        Use the{" "}
        <Link href="/imam" className="underline">
          Imam Dashboard
        </Link>{" "}
        to edit your masjid profile, upload photos, set prayer times, create
        events and manage donation campaigns. Visit{" "}
        <Link href="/imam/profile" className="underline">
          Masjid Profile
        </Link>{" "}
        to update general information and socials.
      </>
    ),
  },
  {
    q: "How do donations work?",
    a: (
      <>
        Community members can support masjids via{" "}
        <Link href="/dashboard/donate" className="underline">
          Donations
        </Link>
        . Imams can create and manage campaigns from{" "}
        <Link href="/imam/donations" className="underline">
          Imam Donations
        </Link>
        .
      </>
    ),
  },
  {
    q: "My location or prayer times look incorrect. What should I do?",
    a: "Check your browser’s location permissions, refresh the page, and verify your calculation method in Azan Settings. If the issue persists, try a different network or device.",
  },
  {
    q: "Is there a mobile app?",
    a: "MasjidLink is a responsive web app optimized for mobile browsers. Native apps may be introduced later.",
  },
  {
    q: "Where can I read your Privacy Policy and Terms?",
    a: (
      <>
        Review our{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="underline">
          Terms of Service
        </Link>
        .
      </>
    ),
  },
  {
    q: "How can I contact support?",
    a: (
      <>
        Visit{" "}
        <Link href="/contact" className="underline">
          Contact
        </Link>{" "}
        to reach our team.
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-muted-foreground">
          Quick answers to common questions about MasjidLink for community
          members and masjid leaders.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/help">Go to Help Center</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((item, idx) => (
          <Card key={idx} className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">{item.q}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.a}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
