"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

function Livestream() {
  const client = useStreamVideoClient();
  const { user } = useAuth();
  const [value, setValue] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const router = useRouter();

  const [callDetails, setCallDetails] = useState<Call>();

  console.log("Livestream client", client);
  console.log("Livestream user", user);

  const createMeeting = async () => {
    if (!client || !user) {
      console.error("Client or user not available");
      return;
    }

    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) {
        console.error("Failed to create call instance");
        return;
      }

      const startAt = value.dateTime.toISOString();
      const description = value.description || "No description provided";

      await call.getOrCreate({
        data: { starts_at: startAt, custom: { description } },
      });

      setCallDetails(call);

      if (!value.link) {
        router.push(`/livestream/${call.id}`);
      }

      toast.success("Meeting created successfully");

      // await call.join({ create: true });
      // console.log("Meeting created successfully");
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };
  return (
    <div>
      <Button onClick={createMeeting}>Create Meeting</Button>
    </div>
  );
}

export default Livestream;
