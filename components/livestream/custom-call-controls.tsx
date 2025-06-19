import React from "react";
import {
  useCallStateHooks,
  useCall,
  CallControls,
} from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Settings,
  ScreenShare,
  ScreenShareOff,
} from "lucide-react";

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
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Leave call button */}
        <Button
          onClick={onLeave || (() => call?.leave())}
          variant="destructive"
          size="sm"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
        >
          <PhoneOff size={14} className="sm:w-[18px] sm:h-[18px]" />
        </Button>

        {/* Settings (device settings disabled for viewers) - hidden on mobile */}
        <Button
          disabled
          variant="outline"
          size="sm"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 opacity-50 cursor-not-allowed hidden sm:flex"
          title="Device settings not available for viewers"
        >
          <Settings size={14} className="sm:w-[18px] sm:h-[18px]" />
        </Button>

        {/* Disabled mic button to show viewer status */}
        <Button
          disabled
          variant="outline"
          size="sm"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 opacity-50 cursor-not-allowed"
          title="Microphone not available for viewers"
        >
          <MicOff size={14} className="sm:w-[18px] sm:h-[18px]" />
        </Button>

        {/* Disabled camera button to show viewer status */}
        <Button
          disabled
          variant="outline"
          size="sm"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 opacity-50 cursor-not-allowed"
          title="Camera not available for viewers"
        >
          <VideoOff size={14} className="sm:w-[18px] sm:h-[18px]" />
        </Button>
      </div>
    );
  }

  // For hosts, show full controls
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Microphone toggle */}
      <Button
        onClick={() => microphone.toggle()}
        variant={isMicOff ? "destructive" : "default"}
        size="sm"
        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
      >
        {isMicOff ? (
          <MicOff size={14} className="sm:w-[18px] sm:h-[18px]" />
        ) : (
          <Mic size={14} className="sm:w-[18px] sm:h-[18px]" />
        )}
      </Button>

      {/* Camera toggle */}
      <Button
        onClick={() => camera.toggle()}
        variant={isCameraOff ? "destructive" : "default"}
        size="sm"
        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
      >
        {isCameraOff ? (
          <VideoOff size={14} className="sm:w-[18px] sm:h-[18px]" />
        ) : (
          <Video size={14} className="sm:w-[18px] sm:h-[18px]" />
        )}
      </Button>

      {/* Screen share toggle - hidden on mobile */}
      <Button
        onClick={() => screenShare.toggle()}
        variant={isScreenShareOff ? "default" : "secondary"}
        size="sm"
        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 hidden sm:flex"
      >
        {isScreenShareOff ? (
          <ScreenShare size={14} className="sm:w-[18px] sm:h-[18px]" />
        ) : (
          <ScreenShareOff size={14} className="sm:w-[18px] sm:h-[18px]" />
        )}
      </Button>

      {/* Leave call */}
      <Button
        onClick={onLeave || (() => call?.leave())}
        variant="destructive"
        size="sm"
        className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
      >
        <PhoneOff size={14} className="sm:w-[18px] sm:h-[18px]" />
      </Button>
    </div>
  );
}

export default CustomCallControls;
