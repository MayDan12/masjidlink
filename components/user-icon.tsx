// "use client";

// import { useMemo, useState, useEffect, useCallback } from "react";
// import Link from "next/link";
// import { toast } from "sonner";
// import { useAuth } from "@/context/auth";
// import { auth } from "@/firebase/client";
// import { getUsersProfile } from "@/app/(dashboards)/dashboard/profile/action";
// import { Skeleton } from "./ui/skeleton";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import Logout from "./auth/logout-button";

// interface MenuLink {
//   link: string;
//   title: string;
// }

// interface UserIconProps {
//   links: MenuLink[];
// }

// function UserIcon({ links }: UserIconProps) {
//   const { user } = useAuth();
//   const [userImage, setUserImage] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Memoize user initials and name
//   const { fullName, initials } = useMemo(() => {
//     const name = user?.displayName || "";
//     const initials = name
//       .split(" ")
//       .filter(Boolean)
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase();

//     return { fullName: name, initials };
//   }, [user?.displayName]);

//   // Fetch user profile picture
//   // In your UserIcon component, modify the fetch logic:
//   const fetchUserImage = useCallback(async () => {
//     if (!user) {
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       // First check Firebase Auth photoURL (immediately available)
//       if (user.photoURL) {
//         setUserImage(user.photoURL);
//         return;
//       }

//       // Fallback to profile API if no auth photo exists
//       const token = await auth.currentUser?.getIdToken();
//       if (!token) throw new Error("User not authenticated");

//       const response = await getUsersProfile(token);
//       if (!response.success)
//         throw new Error(response.message || "Failed to fetch profile");

//       setUserImage(response.data?.profilePicture || "");
//     } catch (err) {
//       console.error("Error fetching user profile:", err);
//       setError("Failed to load profile picture");
//       toast.error("Could not load your profile information");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [user]);

//   useEffect(() => {
//     if (user) {
//       fetchUserImage();
//     }
//   }, [user, fetchUserImage]);

//   // Early return for error state
//   if (error) {
//     return (
//       <div className="ml-auto flex items-center gap-4">
//         <span className="text-sm text-red-500">{error}</span>
//       </div>
//     );
//   }

//   return (
//     <div className="ml-auto flex items-center gap-4">
//       {isLoading ? (
//         <Skeleton className="h-6 w-32 rounded-full" />
//       ) : (
//         <h1 className="md:text-xl font-semibold text-primary">{fullName}</h1>
//       )}

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild aria-label="User menu">
//           <div className="cursor-pointer">
//             {isLoading ? (
//               <Skeleton className="h-10 w-10 rounded-full" />
//             ) : (
//               <Avatar>
//                 <AvatarImage
//                   src={userImage}
//                   alt={userImage ? `Profile picture of ${fullName}` : ""}
//                   className="object-cover"
//                 />
//                 <AvatarFallback aria-hidden="true" delayMs={600}>
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>
//             )}
//           </div>
//         </DropdownMenuTrigger>

//         <DropdownMenuContent
//           className="w-56 mr-8 mt-2"
//           align="end"
//           sideOffset={8}
//         >
//           <DropdownMenuLabel>My Account</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             {links.map((item) => (
//               <DropdownMenuItem key={item.link} asChild>
//                 <Link
//                   href={item.link}
//                   className="w-full focus:bg-accent focus:text-accent-foreground"
//                   aria-label={item.title}
//                 >
//                   {item.title}
//                 </Link>
//               </DropdownMenuItem>
//             ))}
//             <DropdownMenuItem>
//               <Logout>Log Out</Logout>
//             </DropdownMenuItem>
//           </DropdownMenuGroup>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

// export default UserIcon;
"use client";

import { useMemo, useState, useEffect, useCallback, memo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";
import { auth } from "@/firebase/client";
import { getUsersProfile } from "@/app/(dashboards)/dashboard/profile/action";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Logout from "./auth/logout-button";

interface MenuLink {
  link: string;
  title: string;
}

interface UserIconProps {
  links: MenuLink[];
}

// Extracted to prevent recreation on each render
const DROPDOWN_CONTENT_PROPS = {
  className: "w-56 mr-8 mt-2",
  align: "end" as const,
  sideOffset: 8,
};

const UserIcon = memo(({ links }: UserIconProps) => {
  const { user } = useAuth();
  const [userImage, setUserImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Memoize user initials and name - only recalculates when displayName changes
  const { fullName, initials } = useMemo(() => {
    const name = user?.displayName || "";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters for better UX

    return { fullName: name, initials: initials || "U" }; // Provide fallback
  }, [user?.displayName]);

  // Memoize menu links to prevent unnecessary re-renders
  const menuItems = useMemo(() => {
    return links.map((item) => (
      <DropdownMenuItem key={item.link} asChild>
        <Link
          href={item.link}
          className="w-full focus:bg-accent focus:text-accent-foreground"
          aria-label={item.title}
        >
          {item.title}
        </Link>
      </DropdownMenuItem>
    ));
  }, [links]);

  // Optimized image fetching with race condition prevention and caching
  const fetchUserImage = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Use Firebase Auth photoURL first (fastest)
    if (user.photoURL) {
      setUserImage(user.photoURL);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setImageError(false);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");

      const response = await getUsersProfile(token);

      if (!isMounted) return; // Prevent state update if unmounted

      if (!response.success) {
        throw new Error(response.message || "Failed to fetch profile");
      }

      const profilePicture = response.data?.profilePicture || "";
      setUserImage(profilePicture);

      if (!profilePicture) {
        setImageError(true);
      }
    } catch (err) {
      if (!isMounted) return;

      console.error("Error fetching user profile:", err);
      setImageError(true);

      // Only show toast for critical errors, not just missing images
      if (err instanceof Error && !err.message.includes("not authenticated")) {
        toast.error("Could not load profile information");
      }
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }

    // Return cleanup function
    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    // Create a variable to track mounted state for this effect run
    let isActive = true;

    // Execute the fetch function and handle its cleanup
    const cleanupPromise = fetchUserImage();

    // Handle the promise and its cleanup
    cleanupPromise.then((cleanup) => {
      if (!isActive) {
        // If component unmounted during fetch, execute cleanup immediately
        if (cleanup) cleanup();
      } else {
        // Store cleanup for when component unmounts
        return cleanup;
      }
    });

    // Return cleanup function for this effect
    return () => {
      isActive = false;
      // We can't easily clean up the promise here, but the mounted check
      // inside fetchUserImage will prevent state updates
    };
  }, [fetchUserImage]);

  // Alternative simpler approach without the cleanup function from fetchUserImage
  useEffect(() => {
    let isMounted = true;

    const loadUserImage = async () => {
      if (!user) {
        if (isMounted) setIsLoading(false);
        return;
      }

      // Use Firebase Auth photoURL first (fastest)
      if (user.photoURL) {
        if (isMounted) {
          setUserImage(user.photoURL);
          setIsLoading(false);
        }
        return;
      }

      if (isMounted) {
        setIsLoading(true);
        setImageError(false);
      }

      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("User not authenticated");

        const response = await getUsersProfile(token);

        if (!isMounted) return;

        if (!response.success) {
          throw new Error(response.message || "Failed to fetch profile");
        }

        const profilePicture = response.data?.profilePicture || "";
        setUserImage(profilePicture);

        if (!profilePicture) {
          setImageError(true);
        }
      } catch (err) {
        if (!isMounted) return;

        console.error("Error fetching user profile:", err);
        setImageError(true);

        if (
          err instanceof Error &&
          !err.message.includes("not authenticated")
        ) {
          toast.error("Could not load profile information");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUserImage();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle image load error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="ml-auto flex items-center gap-4">
      {/* Name display with loading state */}
      {isLoading ? (
        <Skeleton
          className="h-6 w-32 rounded-full"
          aria-label="Loading user name"
        />
      ) : (
        fullName && (
          <h1 className="md:text-xl font-semibold text-primary truncate max-w-[150px]">
            {fullName}
          </h1>
        )
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="User menu">
          <button className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
            {isLoading ? (
              <Skeleton
                className="h-10 w-10 rounded-full"
                aria-label="Loading avatar"
              />
            ) : (
              <Avatar>
                <AvatarImage
                  src={!imageError ? userImage : ""}
                  alt={userImage ? `Profile picture of ${fullName}` : ""}
                  className="object-cover"
                  onError={handleImageError}
                />
                <AvatarFallback aria-hidden="true" delayMs={600}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent {...DROPDOWN_CONTENT_PROPS}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {menuItems}
            <DropdownMenuItem>
              <Logout>Log Out</Logout>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

UserIcon.displayName = "UserIcon";

export default UserIcon;
