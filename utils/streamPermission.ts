// utils/streamPermissions.ts
import { StreamVideoClient } from "@stream-io/video-react-sdk";

export const createViewerOnlyClient = (
  apiKey: string,
  userId: string,
  userName: string,
  tokenProvider: () => Promise<string>
) => {
  return new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: userName,
      // Add custom data to identify role
      custom: {
        role: "viewer",
      },
    },
    tokenProvider,
    // Additional options to restrict capabilities
    options: {
      // Disable local media by default for viewers
      video: false,
      audio: false,
    },
  });
};

export const createHostClient = (
  apiKey: string,
  userId: string,
  userName: string,
  tokenProvider: () => Promise<string>
) => {
  return new StreamVideoClient({
    apiKey,
    user: {
      id: userId,
      name: userName,
      custom: {
        role: "host",
      },
    },
    tokenProvider,
  });
};

// Helper to enforce viewer restrictions
export const enforceViewerRestrictions = async (call: any) => {
  if (!call) return;

  try {
    // Disable camera and microphone
    await call.camera.disable();
    await call.microphone.disable();

    // Prevent screen sharing for viewers
    if (call.screenShare?.isEnabled) {
      await call.screenShare.disable();
    }
  } catch (error) {
    console.error("Error enforcing viewer restrictions:", error);
  }
};
