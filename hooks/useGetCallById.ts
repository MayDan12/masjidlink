import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (callId: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client || !callId) {
      return;
    }

    const fetchCall = async () => {
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: { id: callId },
        });

        if (calls.length === 0) {
          throw new Error("Call not found");
        }

        if (calls.length > 0) setCall(calls[0]);
        setIsCallLoading(false);
      } catch (err) {
        console.error("Error fetching call:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsCallLoading(false);
      }
    };

    fetchCall();
  }, [client, callId]);

  return { call, isCallLoading, error };
};
