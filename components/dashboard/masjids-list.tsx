"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Search, Heart, Filter, Star } from "lucide-react";
import { getAllMasjids } from "@/app/(dashboards)/dashboard/masjids/action";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MasjidDetails } from "./masjid-details";
import type { Masjid } from "@/types/masjid";
import { Skeleton } from "../ui/skeleton";

const ITEMS_PER_PAGE = 6;

export function MasjidsList() {
  // I want to optimize this page
  const [searchQuery, setSearchQuery] = useState("");
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllMasjids = async () => {
      setLoading(true);
      try {
        const response = await getAllMasjids();
        if (response.success) {
          setMasjids(response.data);
        } else {
          console.error("Failed to fetch masjids:", response.message);
        }
      } catch (error) {
        console.error("Error fetching masjids:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMasjids();
  }, []);

  const handleDetailClick = (masjid: Masjid) => {
    setSelectedMasjid(masjid);
    setDialogOpen(true);
  };

  const toggleFavorite = (id: string) => {
    setMasjids((prev) =>
      prev.map((masjid) =>
        masjid.id === id
          ? { ...masjid, isFavorite: !masjid.isFavorite }
          : masjid,
      ),
    );
  };

  const filteredMasjids = useMemo(() => {
    return masjids.filter((masjid) =>
      masjid.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [masjids, searchQuery]);

  const paginatedMasjids = filteredMasjids.slice(
    0,
    currentPage * ITEMS_PER_PAGE,
  );

  const hasMore = filteredMasjids.length > paginatedMasjids.length;

  return (
    <div className="space-y-4">
      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, address, or city..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Button variant="outline" className="gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Masjid Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto mx-2">
          <DialogHeader>
            <DialogTitle>Masjid Details</DialogTitle>
          </DialogHeader>
          {selectedMasjid && (
            <MasjidDetails
              masjid={selectedMasjid}
              onClose={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Masjid Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* I want to use skeleton and mimic the data structure */}
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <Skeleton
              key={index}
              className="w-full p-5 h-40 sm:h-48 rounded-xl"
            ></Skeleton>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {paginatedMasjids.map((masjid) => (
            <Card key={masjid.id} className="w-full">
              <CardContent className="p-3 sm:p-4">
                <div className="flex gap-2 sm:gap-4">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16 rounded-md flex-shrink-0">
                    <AvatarImage
                      src={masjid.image || "/placeholder.svg"}
                      alt={masjid.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="rounded-md text-xs sm:text-sm">
                      {masjid.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-sm sm:text-base lg:text-lg truncate">
                          {masjid.name}
                        </h3>
                        <div className="flex items-start text-xs sm:text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2 break-words">
                            {masjid.address}, {masjid.city}, {masjid.state}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground flex-shrink-0"
                        onClick={() => toggleFavorite(masjid.id)}
                      >
                        <Heart
                          className={`h-3 w-3 sm:h-4 sm:w-4 transition ${
                            masjid.isFavorite ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                        <span className="sr-only">
                          {masjid.isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"}
                        </span>
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
                      {masjid?.facilityTypes
                        ?.slice(0, 2)
                        .map((facility, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs px-1.5 py-0.5"
                          >
                            {facility}
                          </Badge>
                        ))}
                      {masjid?.facilityTypes?.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs px-1.5 py-0.5"
                        >
                          +{masjid.facilityTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 sm:mt-3 gap-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-medium text-xs sm:text-sm">
                          {masjid.rating}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleDetailClick(masjid)}
                        className="text-xs sm:text-sm px-2 sm:px-3 h-7 sm:h-8"
                      >
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">Details</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
