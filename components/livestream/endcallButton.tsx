import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { PhoneOff } from "lucide-react";

function EndCallButton() {
  const router = useRouter();
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call?.state.createdBy.id;

  if (!isMeetingOwner) {
    return null;
  }

  return (
    <Button
      onClick={async () => {
        await call?.endCall();
        router.push("/imam/events");
      }}
      className="bg-red-500 gap-1 hover:bg-red-400 p-2"
    >
      <PhoneOff className="mr-2 h-4 w-4" />
      End stream
    </Button>
  );
}

export default EndCallButton;
