"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import { getMasjidProfile } from "@/app/(dashboards)/imam/profile/action";

export default function CompleteProfilePopup() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkProfileComplete = async () => {
      try {
        const user = auth?.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        const response = await getMasjidProfile(token);

        const masjid = response?.data?.country;
        console.log(masjid);

        // If masjid does not exist
        if (!masjid) {
          setVisible(true);
        }
      } catch (error) {
        console.error("Profile check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkProfileComplete();
  }, []);

  if (loading) return null;
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl mx-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Complete Your Masjid Profile!
        </h2>
        <p className="text-gray-700 mb-4">
          Enhance your experience by completing your profile information.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setVisible(false)}>Okay Got it</Button>
          <Button onClick={() => router.push("/imam/profile")}>
            Complete Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
