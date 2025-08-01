// "use client";
// import { useAuth } from "@/context/auth";
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
// import Link from "next/link";
// import { useEffect, useState, useMemo } from "react";
// import { getUsersProfile } from "@/app/(dashboards)/dashboard/profile/action";
// import { auth } from "@/firebase/client";
// import { Skeleton } from "./ui/skeleton";
// import { toast } from "sonner";

// interface MenuLink {
//   link: string;
//   title: string;
// }

// interface UserIconProps {
//   links: MenuLink[];
// }

// function UserIcon({ links }: UserIconProps) {
//   const { user } = useAuth();
//   const [userImage, setUserImage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchUserImage() {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const token = await auth.currentUser?.getIdToken();
//         if (!token) {
//           throw new Error("User not authenticated");
//         }

//         const response = await getUsersProfile(token);
//         if (response.success) {
//           setUserImage(response.data?.profilePicture || "");
//         } else {
//           throw new Error(response.message || "Failed to fetch profile");
//         }
//       } catch (error) {
//         console.error("Error fetching user profile:", error);
//         setError("Failed to load profile picture");
//         toast.error("Could not load your profile information");
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     if (user) {
//       fetchUserImage();
//     }
//   }, [user]);

//   const { fullName, initials } = useMemo(() => {
//     const fullName = user?.displayName || "";
//     const initials = fullName
//       .split(" ")
//       .filter((word: string) => word)
//       .map((word: string) => word[0])
//       .join("")
//       .toUpperCase();

//     return { fullName, initials };
//   }, [user?.displayName]);

//   if (error) {
//     return (
//       <div className="ml-auto flex items-center space-x-4">
//         <span className="text-sm text-red-500">{error}</span>
//       </div>
//     );
//   }

//   return (
//     <div className="ml-auto flex items-center space-x-4">
//       {isLoading ? (
//         <Skeleton className="h-6 w-32 rounded-full" />
//       ) : (
//         <h1 className="md:text-xl font-semibold text-primary">{fullName}</h1>
//       )}

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild aria-label="User menu">
//           <div>
//             {isLoading ? (
//               <Skeleton className="h-10 w-10 rounded-full" />
//             ) : (
//               <Avatar>
//                 <AvatarImage
//                   src={userImage}
//                   alt={`Profile picture of ${fullName}`}
//                 />
//                 <AvatarFallback aria-hidden="true">{initials}</AvatarFallback>
//               </Avatar>
//             )}
//           </div>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56 mr-8 mt-2">
//           <DropdownMenuLabel>My Account</DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuGroup>
//             {links.map((item, i) => (
//               <DropdownMenuItem key={`${item.link}-${i}`}>
//                 <Link
//                   href={item.link}
//                   className="w-full"
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

import { useMemo, useState, useEffect, useCallback } from "react";
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

function UserIcon({ links }: UserIconProps) {
  const { user } = useAuth();
  const [userImage, setUserImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize user initials and name
  const { fullName, initials } = useMemo(() => {
    const name = user?.displayName || "";
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    return { fullName: name, initials };
  }, [user?.displayName]);

  // Fetch user profile picture
  // In your UserIcon component, modify the fetch logic:
  const fetchUserImage = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check Firebase Auth photoURL (immediately available)
      if (user.photoURL) {
        setUserImage(user.photoURL);
        return;
      }

      // Fallback to profile API if no auth photo exists
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("User not authenticated");

      const response = await getUsersProfile(token);
      if (!response.success)
        throw new Error(response.message || "Failed to fetch profile");

      setUserImage(response.data?.profilePicture || "");
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile picture");
      toast.error("Could not load your profile information");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserImage();
    }
  }, [user, fetchUserImage]);

  // Early return for error state
  if (error) {
    return (
      <div className="ml-auto flex items-center gap-4">
        <span className="text-sm text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-4">
      {isLoading ? (
        <Skeleton className="h-6 w-32 rounded-full" />
      ) : (
        <h1 className="md:text-xl font-semibold text-primary">{fullName}</h1>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="User menu">
          <div className="cursor-pointer">
            {isLoading ? (
              <Skeleton className="h-10 w-10 rounded-full" />
            ) : (
              <Avatar>
                <AvatarImage
                  src={userImage}
                  alt={userImage ? `Profile picture of ${fullName}` : ""}
                  className="object-cover"
                />
                <AvatarFallback aria-hidden="true" delayMs={600}>
                  {initials}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 mr-8 mt-2"
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {links.map((item) => (
              <DropdownMenuItem key={item.link} asChild>
                <Link
                  href={item.link}
                  className="w-full focus:bg-accent focus:text-accent-foreground"
                  aria-label={item.title}
                >
                  {item.title}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem>
              <Logout>Log Out</Logout>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserIcon;
