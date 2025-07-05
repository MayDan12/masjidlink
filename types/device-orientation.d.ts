/* types/device-orientation.d.ts */
declare global {
  interface DeviceOrientationEventConstructor {
    /** iOS‑only: ask the user for permission */
    requestPermission?: () => Promise<"granted" | "denied">;
  }

  interface Window {
    DeviceOrientationEvent: DeviceOrientationEventConstructor;
  }
}

export {}; // ensure this file is a module
