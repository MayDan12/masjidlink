"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Search, Heart, Filter, Star } from "lucide-react";
import { getAllMasjids } from "@/app/(dashboards)/dashboard/masjids/action";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { MasjidDetails } from "./masjid-details";
import { Masjid } from "@/types/masjid";

export function MasjidsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [masjids, setMasjids] = useState<Masjid[]>([]);
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAllMasjids = async () => {
      try {
        const response = await getAllMasjids();
        console.log(response.data);
        if (response.success) {
          setMasjids(response.data);
        } else {
          console.error("Failed to fetch masjids:", response.message);
        }
      } catch (error) {
        console.error("Error fetching masjids:", error);
      }
    };

    fetchAllMasjids();
  }, []);

  const handleDetailClick = (masjid: Masjid) => {
    setSelectedMasjid(masjid);
    setDialogOpen(true);
  };

  // Filter masjids based on search query
  const filteredMasjids = masjids.filter(
    (masjid) =>
      masjid.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      masjid.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      masjid.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    // In a real app, this would update state and possibly save to a database
    console.log(`Toggle favorite for masjid ${id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, address, or city..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Masjid Details</DialogTitle>
          </DialogHeader>
          {selectedMasjid && (
            <MasjidDetails
              masjid={selectedMasjid}
              onClose={() => setDialogOpen(false)}
              // onSuccess={}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-2 gap-4 space-y-4">
        {filteredMasjids.map((masjid) => (
          <Card key={masjid.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Avatar className="h-16 w-16 rounded-md">
                  <AvatarImage
                    src={masjid.image || "/placeholder.svg"}
                    alt={masjid.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-md">
                    {masjid.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{masjid.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span>
                          {masjid.address}, {masjid.city}, {masjid.state}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={() => toggleFavorite(masjid.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${
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
                  <div className="flex flex-wrap gap-2 mt-3">
                    {masjid?.facilityTypes?.map((facility, index) => (
                      <Badge key={index} variant="outline">
                        {facility}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{masjid.rating}</span>
                    </div>
                    <Button size="sm" onClick={() => handleDetailClick(masjid)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}
