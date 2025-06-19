"use client";
import LiveStreamRoom from "@/components/livestream/livestream-room";
import LivestreamSetup from "@/components/livestream/livestream-setup";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useGetCallById } from "@/hooks/useGetCallById";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { user } = useAuth();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userRole, setUserRole] = useState<"host" | "viewer">("viewer");

  const { call, isCallLoading, error } = useGetCallById(id);

  // Determine user role - you can modify this logic based on your requirements
  useEffect(() => {
    if (call && user) {
      // Check if user is the creator/host of the call
      // This is just an example - adjust based on your data structure
      const isHost = call.state.createdBy?.id === user.uid;
      setUserRole(isHost ? "host" : "viewer");
    }
  }, [call, user]);

  if (isCallLoading) {
    return (
      <div className="flex gap-3 h-screen w-full items-center justify-center">
        <Button>Back</Button>
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">Failed to load livestream</p>
        </div>
      </div>
    );
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <LivestreamSetup
              setIsSetupComplete={setIsSetupComplete}
              userRole={userRole}
            />
          ) : (
            <LiveStreamRoom userRole={userRole} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
}
