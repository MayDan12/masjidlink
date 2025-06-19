// "use client";

// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Search, MapPin, Heart, Loader } from "lucide-react";
// import Link from "next/link";
// import {
//   getAllMasjids,
//   joinMasjid,
// } from "@/app/(dashboards)/dashboard/masjids/action";
// import { Masjid } from "@/types/masjid";
// import { toast } from "sonner";
// import { auth } from "@/firebase/client";

// export type Masjidyt = {
//   id: string;
//   name: string;
//   address: string;
//   city: string;
//   state: string;
//   rating: number;
//   facilityTypes: string[];
//   isFavorite: boolean;
//   image?: string;
//   description?: string;
//   capacity?: string;
//   email?: string;
// };

// export function MasjidDiscovery() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [masjids, setMasjids] = useState<Masjid[]>([]);

//   useEffect(() => {
//     const fetchAllMasjids = async () => {
//       try {
//         const response = await getAllMasjids();
//         console.log(response.data);
//         if (response.success) {
//           setMasjids(response.data);
//         } else {
//           console.error("Failed to fetch masjids:", response.message);
//         }
//       } catch (error) {
//         console.error("Error fetching masjids:", error);
//       }
//     };

//     fetchAllMasjids();
//   }, []);

//   // Filter masjids based on search query
//   const filteredNearby = masjids.filter(
//     (masjid) =>
//       masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       masjid.city.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const filteredPopular = masjids.filter(
//     (masjid) =>
//       masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       masjid.state.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Discover Masjids</CardTitle>
//         <CardDescription>
//           Find and connect with masjids in your area
//         </CardDescription>
//         <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
//           <Input
//             type="text"
//             placeholder="Search by name or location"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="flex-1"
//           />
//           <Button type="submit" size="icon">
//             <Search className="h-4 w-4" />
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="nearby">
//           <TabsList className="mb-4">
//             <TabsTrigger value="nearby">Nearby</TabsTrigger>
//             <TabsTrigger value="popular">Popular</TabsTrigger>
//           </TabsList>
//           <TabsContent value="nearby">
//             <div className="space-y-4">
//               {filteredNearby.length > 0 ? (
//                 filteredNearby.map((masjid) => (
//                   <MasjidCard key={masjid.id} masjid={masjid} />
//                 ))
//               ) : (
//                 <p className="text-center text-muted-foreground py-4">
//                   No nearby masjids found
//                 </p>
//               )}
//             </div>
//           </TabsContent>
//           <TabsContent value="popular">
//             <div className="space-y-4">
//               {filteredPopular.length > 0 ? (
//                 filteredPopular.map((masjid) => (
//                   <MasjidCard key={masjid.id} masjid={masjid} />
//                 ))
//               ) : (
//                 <p className="text-center text-muted-foreground py-4">
//                   No popular masjids found
//                 </p>
//               )}
//             </div>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// }

// function MasjidCard({ masjid }: { masjid: Masjid }) {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleJoin = async (masjidId: string) => {
//     setIsLoading(true);
//     try {
//       const token = await auth.currentUser?.getIdToken();
//       if (!token) {
//         toast.error("Authentication required");
//         return;
//       }

//       const join = await joinMasjid({ masjidId, token });
//       if (join.success) {
//         toast.success(join.message);
//         setIsFollowing(true);
//       } else {
//         toast.error(join.message);
//       }
//       console.log(join.message);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-start space-x-4 p-4 border rounded-lg">
//       <Avatar className="h-16 w-16">
//         <AvatarImage
//           src={masjid.image || "/placeholder.svg"}
//           alt={masjid.name}
//         />
//         <AvatarFallback>{masjid.name.substring(0, 2)}</AvatarFallback>
//       </Avatar>
//       <div className="flex-1 min-w-0">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="font-semibold text-lg">{masjid.name}</h3>
//             <h3 className="font-semibold text-sm text-gray-400">
//               {masjid.description}
//             </h3>
//             <div className="flex items-center text-sm text-muted-foreground">
//               <MapPin className="h-3 w-3 mr-1" />
//               <span>
//                 {masjid.address} {masjid.state}
//               </span>
//               <span className="mx-2">•</span>
//               <span>{masjid.city}</span>
//             </div>
//           </div>
//           <Button
//             variant={isFollowing ? "secondary" : "outline"}
//             size="sm"
//             onClick={() => handleJoin(masjid.id)}
//             className="flex items-center gap-1"
//           >
//             {isLoading ? (
//               <Loader className="h-4 w-4 animate-spin" />
//             ) : (
//               <>
//                 <Heart
//                   className="h-4 w-4"
//                   fill={isFollowing ? "currentColor" : "none"}
//                 />
//                 <span>{isFollowing ? "Following" : "Follow"}</span>
//               </>
//             )}
//           </Button>
//         </div>
//         <div className="mt-2 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-xs">
//               {masjid.followersCount} followers
//             </Badge>
//             <Badge variant="secondary" className="text-xs">
//               {/* {masjid.nextPrayer}: {masjid.nextPrayerTime} */}
//             </Badge>
//           </div>
//           <Button variant="link" size="sm" asChild>
//             <Link href={`/dashboard/masjids`}>View Profile</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState, useMemo, useCallback } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Search, MapPin, Heart, Loader2 } from "lucide-react";
// import Link from "next/link";
// import {
//   getAllMasjids,
//   joinMasjid,
// } from "@/app/(dashboards)/dashboard/masjids/action";
// import { Masjid } from "@/types/masjid";
// import { toast } from "sonner";
// import { auth } from "@/firebase/client";

// // Separate MasjidCard component
// function MasjidCard({ masjid }: { masjid: Masjid }) {
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleJoin = async (masjidId: string) => {
//     setIsLoading(true);
//     try {
//       const token = await auth.currentUser?.getIdToken();
//       if (!token) {
//         toast.error("Please sign in to follow masjids");
//         return;
//       }

//       const join = await joinMasjid({ masjidId, token });
//       if (join.success) {
//         toast.success(join.message);
//         setIsFollowing(true);
//       } else {
//         toast.error(join.message);
//       }
//     } catch (error) {
//       console.error("Follow error:", error);
//       toast.error("Failed to follow masjid");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-start gap-4 p-4 border rounded-lg">
//       <Avatar className="h-16 w-16">
//         <AvatarImage
//           src={masjid.image || "/placeholder.svg"}
//           alt={masjid.name}
//           className="object-cover"
//         />
//         <AvatarFallback>
//           {masjid.name.substring(0, 2).toUpperCase()}
//         </AvatarFallback>
//       </Avatar>
//       <div className="flex-1 min-w-0">
//         <div className="flex justify-between items-start gap-2">
//           <div>
//             <h3 className="font-semibold text-lg truncate">{masjid.name}</h3>
//             {masjid.description && (
//               <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-full">
//                 {masjid.description}
//               </p>
//             )}
//             <div className="flex items-center text-sm text-muted-foreground mt-1">
//               <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
//               <span className="truncate">
//                 {masjid.address}, {masjid.city}, {masjid.state}
//               </span>
//             </div>
//           </div>
//           <Button
//             variant={isFollowing ? "secondary" : "outline"}
//             size="sm"
//             onClick={() => handleJoin(masjid.id)}
//             className="flex items-center gap-1 flex-shrink-0"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <>
//                 <Heart
//                   className="h-4 w-4"
//                   fill={isFollowing ? "currentColor" : "none"}
//                 />
//                 <span>{isFollowing ? "Following" : "Follow"}</span>
//               </>
//             )}
//           </Button>
//         </div>
//         <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-xs">
//               {masjid.followersCount} followers
//             </Badge>
//             {/* {masjid.nextPrayerTime && (
//               <Badge variant="secondary" className="text-xs">
//                 {masjid.nextPrayer}: {masjid.nextPrayerTime}
//               </Badge>
//             )} */}
//           </div>
//           <Button variant="link" size="sm" asChild>
//             <Link href={`/dashboard/masjids/${masjid.id}`}>View Profile</Link>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function MasjidDiscovery() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [masjids, setMasjids] = useState<Masjid[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // Memoized filtered masjids
//   const filteredMasjids = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     return {
//       nearby: masjids.filter(
//         (masjid) =>
//           masjid.name.toLowerCase().includes(query) ||
//           masjid.city.toLowerCase().includes(query)
//       ),
//       popular: masjids.filter(
//         (masjid) =>
//           masjid.name.toLowerCase().includes(query) ||
//           masjid.state.toLowerCase().includes(query)
//       ),
//     };
//   }, [masjids, searchQuery]);

//   // Fetch masjids with error handling
//   const fetchAllMasjids = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const response = await getAllMasjids();
//       if (response.success) {
//         setMasjids(response.data);
//       } else {
//         console.error("Failed to fetch masjids:", response.message);
//         toast.error("Failed to load masjids");
//       }
//     } catch (error) {
//       console.error("Error fetching masjids:", error);
//       toast.error("An error occurred while loading masjids");
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAllMasjids();
//   }, [fetchAllMasjids]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Discover Masjids</CardTitle>
//         <CardDescription>
//           Find and connect with masjids in your area
//         </CardDescription>
//         <div className="flex w-full max-w-sm items-center gap-2 mt-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               type="text"
//               placeholder="Search by name or location"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-9"
//             />
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent>
//         {isLoading ? (
//           <div className="space-y-4">
//             {[...Array(3)].map((_, i) => (
//               <div
//                 key={i}
//                 className="flex items-start gap-4 p-4 border rounded-lg"
//               >
//                 <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
//                 <div className="flex-1 space-y-2">
//                   <div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
//                   <div className="h-4 w-full bg-muted rounded animate-pulse" />
//                   <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <Tabs defaultValue="nearby">
//             <TabsList className="mb-4">
//               <TabsTrigger value="nearby">Nearby</TabsTrigger>
//               <TabsTrigger value="popular">Popular</TabsTrigger>
//             </TabsList>
//             <TabsContent value="nearby">
//               <div className="space-y-4">
//                 {filteredMasjids.nearby.length > 0 ? (
//                   filteredMasjids.nearby.map((masjid) => (
//                     <MasjidCard key={masjid.id} masjid={masjid} />
//                   ))
//                 ) : (
//                   <p className="text-center text-muted-foreground py-4">
//                     No nearby masjids found
//                   </p>
//                 )}
//               </div>
//             </TabsContent>
//             <TabsContent value="popular">
//               <div className="space-y-4">
//                 {filteredMasjids.popular.length > 0 ? (
//                   filteredMasjids.popular.map((masjid) => (
//                     <MasjidCard key={masjid.id} masjid={masjid} />
//                   ))
//                 ) : (
//                   <p className="text-center text-muted-foreground py-4">
//                     No popular masjids found
//                   </p>
//                 )}
//               </div>
//             </TabsContent>
//           </Tabs>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import {
  getAllMasjids,
  joinMasjid,
} from "@/app/(dashboards)/dashboard/masjids/action";
// Replace the MasjidCard component with this responsive version
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/firebase/client";
import { Masjid } from "@/types/masjid";
// import { toast } from "@/components/ui/use-toast"
// import { auth } from "@/lib/firebase"
// import { getAllMasjids, joinMasjid } from "@/lib/requests"
// import type { Masjid } from "@/types"
import { Heart, Loader2, MapPin, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

function MasjidCard({ masjid }: { masjid: Masjid }) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async (masjidId: string) => {
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("Please sign in to follow masjids");
        return;
      }

      const join = await joinMasjid({ masjidId, token });
      if (join.success) {
        toast.success(join.message);
        setIsFollowing(true);
      } else {
        toast.error(join.message);
      }
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Failed to follow masjid");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-3 sm:p-4 border rounded-lg">
      <Avatar className="h-12 w-12 sm:h-16 sm:w-16 self-center sm:self-start mb-2 sm:mb-0">
        <AvatarImage
          src={masjid.image || "/placeholder.svg"}
          alt={masjid.name}
          className="object-cover"
        />
        <AvatarFallback>
          {masjid.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-2">
          <div className="w-full text-center sm:text-left">
            <h3 className="font-semibold text-base sm:text-lg truncate max-w-full">
              {masjid.name}
            </h3>
            {masjid.description && (
              <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-full">
                {masjid.description}
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">
                {masjid.address}, {masjid.city}, {masjid.state}
              </span>
            </div>
          </div>
          <Button
            variant={isFollowing ? "secondary" : "outline"}
            size="sm"
            onClick={() => handleJoin(masjid.id)}
            className="flex items-center gap-1 flex-shrink-0 mt-2 sm:mt-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <>
                <Heart
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  fill={isFollowing ? "currentColor" : "none"}
                />
                <span>{isFollowing ? "Following" : "Follow"}</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex xs:hidden items-center justify-center text-xs text-muted-foreground mt-1 mb-2">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {masjid.address}, {masjid.city}, {masjid.state}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {masjid.followersCount} followers
            </Badge>
          </div>
          <Button variant="link" size="sm" asChild className="px-0 sm:px-4">
            <Link href={`/dashboard/masjids/${masjid.id}`}>View Profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Replace the MasjidDiscovery component with this responsive version
export function MasjidDiscovery() {
  const [searchQuery, setSearchQuery] = useState("");
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoized filtered masjids
  const filteredMasjids = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return {
      nearby: masjids.filter(
        (masjid) =>
          masjid.name.toLowerCase().includes(query) ||
          masjid.city.toLowerCase().includes(query)
      ),
      popular: masjids.filter(
        (masjid) =>
          masjid.name.toLowerCase().includes(query) ||
          masjid.state.toLowerCase().includes(query)
      ),
    };
  }, [masjids, searchQuery]);

  // Fetch masjids with error handling
  const fetchAllMasjids = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllMasjids();
      if (response.success) {
        setMasjids(response.data);
      } else {
        console.error("Failed to fetch masjids:", response.message);
        toast.error("Failed to load masjids");
      }
    } catch (error) {
      console.error("Error fetching masjids:", error);
      toast.error("An error occurred while loading masjids");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMasjids();
  }, [fetchAllMasjids]);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-center sm:text-left text-xl">
          Discover Masjids
        </CardTitle>
        <CardDescription className="text-center sm:text-left">
          Find and connect with masjids in your area
        </CardDescription>
        <div className="flex w-full max-w-sm items-center gap-2 mt-4 mx-auto sm:mx-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 border rounded-lg"
              >
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-muted animate-pulse mb-2 sm:mb-0" />
                <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse mx-auto sm:mx-0" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted rounded animate-pulse mx-auto sm:mx-0" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue="nearby">
            <TabsList className="mb-4 w-full sm:w-auto">
              <TabsTrigger value="nearby" className="flex-1 sm:flex-none">
                Nearby
              </TabsTrigger>
              <TabsTrigger value="popular" className="flex-1 sm:flex-none">
                Popular
              </TabsTrigger>
            </TabsList>
            <TabsContent value="nearby">
              <div className="space-y-3">
                {filteredMasjids.nearby.length > 0 ? (
                  filteredMasjids.nearby.map((masjid) => (
                    <MasjidCard key={masjid.id} masjid={masjid} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    No nearby masjids found
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="popular">
              <div className="space-y-3">
                {filteredMasjids.popular.length > 0 ? (
                  filteredMasjids.popular.map((masjid) => (
                    <MasjidCard key={masjid.id} masjid={masjid} />
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4 text-sm">
                    No popular masjids found
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
