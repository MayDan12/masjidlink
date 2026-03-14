import React from "react";
import { useCallStateHooks, useCall } from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomCallControlsProps {
  userRole: "host" | "viewer";
  onLeave?: () => void;
}

function CustomCallControls({ userRole, onLeave }: CustomCallControlsProps) {
  const call = useCall();
  const { useCameraState, useMicrophoneState, useScreenShareState } =
    useCallStateHooks();

  const { camera, isMute: isCameraOff } = useCameraState();
  const { microphone, isMute: isMicOff } = useMicrophoneState();
  const { screenShare, isMute: isScreenShareOff } = useScreenShareState();

  // For viewers, just show basic controls without mic/camera
  if (userRole === "viewer") {
    return (
      <div className="flex items-center gap-3">
        {/* Leave call button */}
        <Button
          onClick={onLeave || (() => call?.leave())}
          variant="destructive"
          className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>

        {/* Disabled mic button to show viewer status */}
        <Button
          disabled
          variant="ghost"
          className="w-12 h-12 rounded-xl bg-[#1a1a1e] text-gray-600 border border-gray-800 opacity-50 cursor-not-allowed"
          title="Microphone not available for viewers"
        >
          <MicOff className="w-5 h-5" />
        </Button>

        {/* Disabled camera button to show viewer status */}
        <Button
          disabled
          variant="ghost"
          className="w-12 h-12 rounded-xl bg-[#1a1a1e] text-gray-600 border border-gray-800 opacity-50 cursor-not-allowed"
          title="Camera not available for viewers"
        >
          <VideoOff className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  // For hosts, show full controls
  return (
    <div className="flex items-center gap-3">
      {/* Microphone toggle */}
      <Button
        onClick={() => microphone.toggle()}
        variant="ghost"
        className={cn(
          "w-12 h-12 rounded-xl border transition-all",
          isMicOff
            ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
            : "bg-[#1a1a1e] text-white border-gray-800 hover:bg-gray-800",
        )}
      >
        {isMicOff ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      {/* Camera toggle */}
      <Button
        onClick={() => camera.toggle()}
        variant="ghost"
        className={cn(
          "w-12 h-12 rounded-xl border transition-all",
          isCameraOff
            ? "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
            : "bg-[#1a1a1e] text-white border-gray-800 hover:bg-gray-800",
        )}
      >
        {isCameraOff ? (
          <VideoOff className="w-5 h-5" />
        ) : (
          <Video className="w-5 h-5" />
        )}
      </Button>

      {/* Screen share toggle */}
      <Button
        onClick={() => screenShare.toggle()}
        variant="ghost"
        className={cn(
          "w-12 h-12 rounded-xl border transition-all hidden sm:flex items-center justify-center",
          !isScreenShareOff
            ? "bg-purple-600 text-white border-purple-500"
            : "bg-[#1a1a1e] text-white border-gray-800 hover:bg-gray-800",
        )}
      >
        {isScreenShareOff ? (
          <ScreenShare className="w-5 h-5" />
        ) : (
          <ScreenShareOff className="w-5 h-5" />
        )}
      </Button>

      {/* Leave call */}
      <Button
        onClick={onLeave || (() => call?.leave())}
        variant="destructive"
        className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
      >
        <PhoneOff className="w-5 h-5" />
      </Button>
    </div>
  );
}

export default CustomCallControls;
