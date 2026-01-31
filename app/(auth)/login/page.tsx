import Link from "next/link";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import Image from "next/image";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - MasjidLink",
  description: "Login to your MasjidLink account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col px-16">
      <main className="flex-1">
        <div className="relative flex min-h-screen flex-col items-center justify-center md:grid lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 lg:flex dark:border-r">
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 via-primary/10 to-primary/5">
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
                <p className="text-lg">
                  <span className="font-amiri text-2xl font-medium">
                    &quot;الحمد لله رب العالمين&quot;
                  </span>
                  <br />
                  <span className="text-base text-muted-foreground">
                    All praise is due to Allah, Lord of the worlds.
                  </span>
                </p>
                <footer className="text-sm">Surah Al-Fatihah 1:1</footer>
              </blockquote>
            </div>
          </div>
          <div className="lg:p-8 w-full">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px]">
              <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground">
                  Sign in to your account to continue your journey
                </p>
              </div>
              <Suspense fallback={<Loader2 className="animate-spin" />}>
                <LoginForm />
              </Suspense>
              <div className="flex justify-center">
                <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-medium hover:underline"
                  >
                    Create an account
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
