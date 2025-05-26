"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Star, X, Heart, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Masjid } from "@/types/masjid";
import { auth } from "@/firebase/client";
import { joinMasjid } from "@/app/(dashboards)/dashboard/masjids/action";
import { toast } from "sonner";

interface MasjidDetailsProps {
  masjid: Masjid;
  onClose: () => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export function MasjidDetails({
  masjid,
  onClose,
  onToggleFavorite,
}: MasjidDetailsProps) {
  const [isFavorite, setIsFavorite] = useState(masjid.isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    onToggleFavorite?.(masjid.id, newFavoriteState);
  };

  const handleJoin = async (masjidId: string) => {
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      const join = await joinMasjid({ masjidId, token });
      if (join.success) {
        toast.success(join.message);
      } else {
        toast.error(join.message);
      }
      console.log(join.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="relative p-0">
        <div className="relative h-48 w-full">
          <Image
            src={masjid.image || "/placeholder.svg?height=400&width=600"}
            alt={masjid.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h2 className="text-xl font-bold">{masjid.name}</h2>
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              <span>
                {masjid.city}, {masjid.state}
              </span>
            </div>
            <span>{masjid.email}</span>
          </div>
          <div className="absolute right-2 top-2 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-rose-500 text-rose-500" : "text-white"
                }`}
              />
              <span className="sr-only">Toggle favorite</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={onClose}
            >
              <X className="h-4 w-4 text-white" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid gap-3 mb-2">
          <h1 className="text-sm font-semibold">{masjid.description}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(masjid.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium">
                {/* {masjid.rating.toFixed(1)} */}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="mb-3 flex gap-4">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Address
            </h3>
            <p className="text-sm">{masjid.address}</p>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">
              Capacity
            </h3>
            <p className="text-sm">{masjid.capacity}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            Facilities
          </h3>
          <div className="flex flex-wrap gap-2">
            {masjid.facilityTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/30 p-4">
        <Button className="w-full" onClick={() => handleJoin(masjid.id)}>
          {isLoading ? (
            <Loader className="animate-spin h-4 w-4" />
          ) : (
            "Join Masjid"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
