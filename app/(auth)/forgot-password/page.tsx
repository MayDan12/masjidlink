"use client";
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email) return;

    try {
      setLoading(true);
      setMessage("");

      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: false,
      });

      toast.success("If an account exists, a reset link has been sent.");
      setMessage("If an account exists, a reset link has been sent.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error: any) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-96">
        <CardHeader>
          <h1 className="text-3xl font-bold text-primary">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-300">
            Enter your email to reset your password
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Reset Password"}
              </Button>
            </div>

            {message && (
              <p className="text-sm text-center text-gray-600">{message}</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
