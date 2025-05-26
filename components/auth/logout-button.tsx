"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useAuth } from "@/context/auth";
import { ReactNode } from "react";
import { LogOut } from "lucide-react";

interface LogoutProps {
  children: ReactNode;
}

function Logout({ children }: LogoutProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...");
      // 3. Call the signOut function
      await signOut();
      router.push("/");
      console.log("Signed out successfully!");
    } catch (error) {
      console.error("Failed to sign out:", error);
      // Optional: Show an error message to the user
    }
  };
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2"
      asChild
      onClick={handleLogout}
    >
      <span>
        <LogOut className="h-5 w-5" />
        {children}
      </span>
    </Button>
  );
}

export default Logout;
