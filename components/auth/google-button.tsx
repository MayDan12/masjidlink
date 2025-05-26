import { Button } from "../ui/button";
import { useState } from "react";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";
// import { LoaderCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase/client";

function GoogleButton() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Function to create a session
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await signInWithGoogle();
      const userDocRef = doc(firestore, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create user document with default role "user"
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          role: "user", // Default role
          donorRank: "Muḥsin",
          followingMasjids: [],
          termsAccepted: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      if (result && result.user) {
        // Call getIdTokenResult() on the user object - this is ASYNCHRONOUS
        const idTokenResult = await result.user.getIdTokenResult();
        // Custom claims are inside the 'claims' property
        const customClaims = idTokenResult.claims;
        // Example: Accessing a specific role claim
        const userAdminRole = customClaims.role; // Assuming you set a 'role' claim

        const response = await fetch("/api/auth/checkroles", {
          method: "POST",
          body: JSON.stringify({ uid: result.user.uid }),
          headers: { "Content-Type": "application/json" },
        });

        const userRole = await response.json(); // Fetch user role from Firestore
        console.log(userRole.role);
        // Now you can perform actions based on the role/claims
        if (userAdminRole === "admin") {
          // Redirect to admin dashboard
          router.push("/admin");
        } else if (userRole.role === "imam") {
          // console.log("This is an imam");
          // Redirect to imam dashboard, etc.
          router.push("/imam");
        } else if (userRole.role === "user") {
          // Redirect to user dashboard
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Google Login Failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="bg-background"
      onClick={handleGoogleLogin}
    >
      <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
        <path d="M1 1h22v22H1z" fill="none" />
      </svg>
      Google
    </Button>
  );
}

export default GoogleButton;
