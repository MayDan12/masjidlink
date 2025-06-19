// "use client";
// import { auth } from "@/firebase/client";
// import {
//   // StreamCall,
//   StreamVideo,
//   StreamVideoClient,
// } from "@stream-io/video-react-sdk";
// import { onAuthStateChanged } from "firebase/auth";
// import { ReactNode, useEffect, useState } from "react";
// import { tokenProvider } from "./stream.action";
// import { Loader } from "lucide-react";

// const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

// const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
//   const [videoClient, setVideoClient] = useState<StreamVideoClient>();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
//       if (!firebaseUser) {
//         console.warn("No Firebase user signed in.");
//         return;
//       }

//       const userId = firebaseUser.uid;

//       if (!apiKey) {
//         console.error("Stream API key is not defined.");
//         return;
//       }

//       const client = new StreamVideoClient({
//         apiKey,
//         user: { id: userId, name: firebaseUser.displayName || userId },
//         tokenProvider: tokenProvider,
//       });

//       setVideoClient(client);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (!videoClient) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Loader className="animate-spin" />
//       </div>
//     ); // or a spinner
//   }

//   return <StreamVideo client={videoClient}>{children}</StreamVideo>;
// };

// export default StreamVideoProvider;

"use client";
import { auth } from "@/firebase/client";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { onAuthStateChanged } from "firebase/auth";
import { ReactNode, useEffect, useState } from "react";
import { tokenProvider } from "./stream.action";
import { Loader } from "lucide-react";
import {
  createViewerOnlyClient,
  createHostClient,
} from "@/utils/streamPermission";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

interface StreamVideoProviderProps {
  children: ReactNode;
  userRole?: "host" | "viewer";
}

const StreamVideoProvider = ({
  children,
  userRole = "viewer",
}: StreamVideoProviderProps) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        console.warn("No Firebase user signed in.");
        setVideoClient(undefined);
        return;
      }

      const userId = firebaseUser.uid;
      const userName = firebaseUser.displayName || userId;

      if (!apiKey) {
        console.error("Stream API key is not defined.");
        return;
      }

      // Create client based on user role
      let client: StreamVideoClient;

      if (userRole === "host") {
        client = createHostClient(apiKey, userId, userName, tokenProvider);
      } else {
        client = createViewerOnlyClient(
          apiKey,
          userId,
          userName,
          tokenProvider
        );
      }

      setVideoClient(client);
    });

    return () => unsubscribe();
  }, [userRole]);

  if (!videoClient) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
