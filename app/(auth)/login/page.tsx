import Link from "next/link";
import { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 mr-2 text-primary"
                >
                  <path d="M8 19H5c-1.105 0-1.99-.895-1.99-2 0-1-.006-1.909 0-3.003.006-1.14.118-1.998 1.246-1.998 1-.002 2.995 0 3.744 0"></path>
                  <path d="M19 19h-4c-1.105 0-2-.895-2-2 0-1 0-8 1.248-8 1 0 3.332 0 4.752 0 1 0 1-.001 1 1 0 1 0 7-.996 9Z"></path>
                  <path d="M8 19c0-3.79.229-6.295 1.558-7.578"></path>
                  <path d="M9.25 7.825A5.5 5.5 0 0 1 14.5 3a5.5 5.5 0 0 1 5.204 3.663c.72.058.14.118.209.177.773.65 1.08.978 1.084 1.374.004.397-.295.723-1.084 1.376-.01.007-.018.015-.027.022"></path>
                </svg>
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
              <LoginForm />
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
