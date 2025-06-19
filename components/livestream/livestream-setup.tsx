// "use client";
// import {
//   DeviceSettings,
//   VideoPreview,
//   useCall,
// } from "@stream-io/video-react-sdk";
// import { useEffect, useState } from "react";
// import { Label } from "../ui/label";
// import { Checkbox } from "../ui/checkbox";
// import { Button } from "../ui/button";

// function LivestreamSetup({
//   setIsSetupComplete,
// }: {
//   setIsSetupComplete: (valur: boolean) => void;
// }) {
//   const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);

//   const call = useCall();

//   if (!call) throw new Error("useCall must be used within StramCall component");

//   useEffect(() => {
//     if (isMicCamToggledOn) {
//       call?.camera.disable();
//       call?.microphone.disable();
//     } else {
//       call?.camera.enable();
//       call?.microphone.enable();
//     }
//   }, [isMicCamToggledOn, call?.camera, call?.microphone]);
//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
//       <h1>Setup</h1>
//       <VideoPreview />
//       <div className="flex h-16 items-center justify-center gap-3">
//         <div className="flex items-center justify-center gap-2 font-medium">
//           <Checkbox
//             id="terms"
//             checked={isMicCamToggledOn}
//             onCheckedChange={(checked) =>
//               setIsMicCamToggledOn(checked === true)
//             }
//           />
//           <Label htmlFor="terms">Join with mic and camera off</Label>
//         </div>
//         <DeviceSettings />
//       </div>
//       <Button
//         onClick={() => {
//           call?.join();
//           setIsSetupComplete(true);
//         }}
//       >
//         Join livestream
//       </Button>
//     </div>
//   );
// }

// export default LivestreamSetup;

// "use client";
// import {
//   DeviceSettings,
//   VideoPreview,
//   useCall,
// } from "@stream-io/video-react-sdk";
// import { useEffect } from "react";
// import { Button } from "../ui/button";

// interface LivestreamSetupProps {
//   setIsSetupComplete: (value: boolean) => void;
//   userRole?: "host" | "viewer"; // Add role prop
// }

// function LivestreamSetup({
//   setIsSetupComplete,
//   userRole = "viewer", // Default to viewer
// }: LivestreamSetupProps) {
//   const call = useCall();

//   if (!call)
//     throw new Error("useCall must be used within StreamCall component");

//   useEffect(() => {
//     // If user is a viewer, always disable mic and camera
//     if (userRole === "viewer") {
//       call?.camera.disable();
//       call?.microphone.disable();
//     } else {
//       // Host can enable devices
//       call?.camera.enable();
//       call?.microphone.enable();
//     }
//   }, [userRole, call?.camera, call?.microphone]);

//   const handleJoin = async () => {
//     if (userRole === "viewer") {
//       // Join as viewer without publishing audio/video
//       await call?.join({
//         create: false,
//         data: {
//           members: [],
//         },
//       });
//     } else {
//       // Host joins normally
//       await call?.join();
//     }
//     setIsSetupComplete(true);
//   };

//   return (
//     <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
//       <h1>{userRole === "host" ? "Host Setup" : "Join Livestream"}</h1>

//       {userRole === "host" ? (
//         <>
//           <VideoPreview />
//           <div className="flex h-16 items-center justify-center gap-3">
//             <DeviceSettings />
//           </div>
//         </>
//       ) : (
//         <div className="text-center">
//           <p className="text-gray-600 mb-4">
//             You&apos;re joining as a viewer. You won&apos;t be able to share
//             your camera or microphone.
//           </p>
//         </div>
//       )}

//       <Button onClick={handleJoin}>
//         {userRole === "host" ? "Start Livestream" : "Join as Viewer"}
//       </Button>
//     </div>
//   );
// }

// export default LivestreamSetup;

"use client";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { useEffect } from "react";
import { Button } from "../ui/button";

interface LivestreamSetupProps {
  setIsSetupComplete: (value: boolean) => void;
  userRole?: "host" | "viewer"; // Add role prop
}

function LivestreamSetup({
  setIsSetupComplete,
  userRole = "viewer", // Default to viewer
}: LivestreamSetupProps) {
  const call = useCall();

  if (!call)
    throw new Error("useCall must be used within StreamCall component");

  useEffect(() => {
    // If user is a viewer, always disable mic and camera
    if (userRole === "viewer") {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      // Host can enable devices
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [userRole, call?.camera, call?.microphone]);

  const handleJoin = async () => {
    try {
      if (userRole === "viewer") {
        // Ensure devices are disabled before joining
        await call?.camera.disable();
        await call?.microphone.disable();

        // Join as viewer without publishing capabilities
        await call?.join({
          create: false,
          data: {
            // Explicitly set as viewer/participant only
            custom: {
              role: "viewer",
            },
          },
        });

        // Double-check devices are disabled after joining
        await call?.camera.disable();
        await call?.microphone.disable();
      } else {
        // Host joins normally with full capabilities
        await call?.join();
      }
      setIsSetupComplete(true);
    } catch (error) {
      console.error("Failed to join call:", error);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
      <h1>{userRole === "host" ? "Host Setup" : "Join Livestream"}</h1>

      {userRole === "host" ? (
        <>
          <VideoPreview />
          <div className="flex h-16 items-center justify-center gap-3">
            <DeviceSettings />
          </div>
        </>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You're joining as a viewer. You won't be able to share your camera
            or microphone.
          </p>
        </div>
      )}

      <Button onClick={handleJoin}>
        {userRole === "host" ? "Start Livestream" : "Join as Viewer"}
      </Button>
    </div>
  );
}

export default LivestreamSetup;
