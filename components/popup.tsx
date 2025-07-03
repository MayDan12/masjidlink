"use client";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export default function PlanPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      setVisible(true);
      // Hide after 15 seconds (optional)
      setTimeout(() => setVisible(false), 10000);
    };

    // Show on initial mount
    showPopup();

    // Show again every 10 minutes (600,000 ms)
    const interval = setInterval(() => {
      showPopup();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl mx-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">
          Welcome back!
        </h2>
        <p className="text-gray-700 mb-4">
          You&apos;re currently on the free plan.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setVisible(false)}>Okay Got it</Button>
          <Button onClick={() => setVisible(false)}>Upgrade to Premium</Button>
        </div>
      </div>
    </div>
  );
}
