"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { addLivestreamDetails } from "../imam/events/action";

interface CreateMeetingButtonProps {
  buttonText?: string;
  description?: string;
  eventId?: string;
  dateTime?: Date;
  onMeetingCreated?: (call: Call) => void;
}

const CreateMeetingButton = ({
  buttonText = "Create Meeting",
  description = "",
  dateTime = new Date(),
  onMeetingCreated,
  eventId,
}: CreateMeetingButtonProps) => {
  const client = useStreamVideoClient();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Wait for both client and user to be ready
  useEffect(() => {
    if (client && user) {
      setIsReady(true);
    }
  }, [client, user]);

  function isValidDate(d: unknown) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  const createMeeting = async () => {
    if (!client || !user) {
      console.error("Client or user not available");
      toast.error("Client or user not available");
      return;
    }

    if (!eventId) {
      toast.warning(
        "Event ID is missing. Cannot attach livestream to an event."
      );
      return;
    }

    try {
      setLoading(true);
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: isValidDate(dateTime)
            ? dateTime.toISOString()
            : new Date().toISOString(),
          custom: { description: description || "No description provided" },
        },
      });

      toast.success("Meeting created successfully");

      onMeetingCreated?.(call); // Optional callback

      const meetingLink = `${process.env.NEXT_PUBLIC_API_URL}/livestream/${call.id}`;
      await addLivestreamDetails({
        meetingLink,
        eventId,
      });

      router.push(`/livestream/${call.id}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={createMeeting}
      disabled={loading || !isReady}
      className="p-2"
      size="sm"
    >
      {loading ? "Creating..." : buttonText}
    </Button>
  );
};

export default CreateMeetingButton;
