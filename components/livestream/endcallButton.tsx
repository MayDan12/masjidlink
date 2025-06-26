// import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
// import { Button } from "../ui/button";
// import { useRouter } from "next/navigation";
// import { PhoneOff } from "lucide-react";

// function EndCallButton() {
//   const router = useRouter();
//   const call = useCall();
//   const { useLocalParticipant } = useCallStateHooks();
//   const localParticipant = useLocalParticipant();

//   const isMeetingOwner =
//     localParticipant &&
//     call?.state.createdBy &&
//     localParticipant.userId === call?.state.createdBy.id;

//   if (!isMeetingOwner) {
//     return null;
//   }

//   return (
//     <Button
//       onClick={async () => {
//         await call?.endCall();
//         router.push("/imam/events");
//       }}
//       className="bg-red-500 gap-1 hover:bg-red-400 p-2"
//     >
//       <PhoneOff className="mr-2 h-4 w-4" />
//       End stream
//     </Button>
//   );
// }

// export default EndCallButton;
import { useCallback } from "react";
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

  /** Disable A/V tracks, then end the call and redirect. */
  const handleEnd = useCallback(async () => {
    if (!call) return;

    // 1 — Stop publishing local tracks
    await Promise.all([
      call.camera?.disable?.(), // turns camera off :contentReference[oaicite:0]{index=0}
      call.microphone?.disable?.(), // mutes mic      :contentReference[oaicite:1]{index=1}
    ]);

    // 2 — Close the room for everyone
    await call.endCall();

    // 3 — Navigate away from the call UI
    router.push("/imam/events");
  }, [call, router]);

  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={handleEnd}
      className="bg-red-500 gap-1 hover:bg-red-400 p-2"
    >
      <PhoneOff className="mr-2 h-4 w-4" />
      End stream
    </Button>
  );
}

export default EndCallButton;
