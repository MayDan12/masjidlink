import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HelpPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Help Center
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical guides and troubleshooting for MasjidLink. Choose your path
          below.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/register">Create Account</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>For Community Members</CardTitle>
            <CardDescription>
              Discover masjids, set azan reminders, and follow events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go to{" "}
                <Link href="/dashboard" className="underline">
                  Dashboard
                </Link>
                .
              </li>
              <li>
                Open{" "}
                <Link href="/dashboard/masjids" className="underline">
                  Masjid Profiles
                </Link>{" "}
                to find and follow local masjids.
              </li>
              <li>
                Configure{" "}
                <Link href="/dashboard/azan-settings" className="underline">
                  Azan Settings
                </Link>{" "}
                for timely notifications.
              </li>
              <li>
                Browse{" "}
                <Link href="/dashboard/events" className="underline">
                  Events
                </Link>{" "}
                and participate in community activities.
              </li>
              <li>
                Support your masjid via{" "}
                <Link href="/dashboard/donate" className="underline">
                  Donations
                </Link>
                .
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Imams & Masjid Leaders</CardTitle>
            <CardDescription>
              Set up and manage your masjid on MasjidLink.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Open the{" "}
                <Link href="/imam" className="underline">
                  Imam Dashboard
                </Link>
                .
              </li>
              <li>
                Update{" "}
                <Link href="/imam/profile" className="underline">
                  Masjid Profile
                </Link>{" "}
                with general information and socials.
              </li>
              <li>
                Set prayer times in{" "}
                <Link href="/imam" className="underline">
                  Prayer Times
                </Link>
                .
              </li>
              <li>
                Create events under{" "}
                <Link href="/imam" className="underline">
                  Upcoming Events
                </Link>
                .
              </li>
              <li>
                Launch donation campaigns from{" "}
                <Link href="/imam/donations" className="underline">
                  Donations
                </Link>
                .
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Fix common issues quickly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>
                Enable location access in your browser for accurate prayer
                times.
              </li>
              <li>Allow notifications to receive azan reminders.</li>
              <li>Refresh the page after changing settings.</li>
              <li>Try a different network or device if data does not load.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Terms</CardTitle>
            <CardDescription>Understand how your data is used.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Read our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
            <CardDescription>Reach our team for support.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Visit{" "}
              <Link href="/contact" className="underline">
                Contact
              </Link>{" "}
              to get in touch.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
