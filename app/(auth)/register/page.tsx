import Link from "next/link";
import { Metadata } from "next";
import { RegistrationForm } from "@/components/auth/registration-form";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Register - MasjidLink",
  description:
    "Create an account on MasjidLink and connect with your local community",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col px-8">
      <main className="flex-1">
        <div className="relative flex min-h-screen flex-col items-center justify-center md:grid lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-primary/5">
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=720&width=720')] bg-center opacity-20 mix-blend-overlay" />
            </div>
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Link href="/" className="flex items-center">
                <Image
                  src="/masjidlink.png"
                  alt="MasjidLink Logo"
                  width={40}
                  height={40}
                  className="mr-2"
                />
                <span className="text-2xl font-semibold text-primary">
                  MasjidLink
                </span>
              </Link>
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg font-medium">
                  &quot;MasjidLink has transformed how our community stays
                  connected. The prayer time notifications and event management
                  features have significantly increased attendance at our
                  masjid.&quot;
                </p>
                <footer className="text-sm">
                  Imam Abdullah, Masjid Al-Noor
                </footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8 w-full mt-10 mb-20">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Join MasjidLink
                </h1>
                <p className="text-muted-foreground">
                  Connect with your local masjid, track prayer times, and
                  strengthen Ummah bonds
                </p>
              </div>
              <RegistrationForm />
              <p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="flex justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
