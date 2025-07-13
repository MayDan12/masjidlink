import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasjidsList } from "@/components/dashboard/masjids-list";
import { MasjidMap } from "@/components/dashboard/masjid-map";
import { SavedMasjids } from "@/components/dashboard/saved-masjids";
// import { MasjidSearch } from "@/components/dashboard/masjid-search";
import { MapPin, Heart, Search } from "lucide-react";

export default function MasjidsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Masjids</h1>
          <p className="text-muted-foreground">
            Discover, explore, and connect with masjids in your community and
            around the world.
          </p>
        </div>
      </div>

      <Tabs defaultValue="discover" className="space-y-4">
        <TabsList>
          <TabsTrigger value="discover" className="flex items-center gap-1">
            <Search className="h-4 w-4" />
            <span>Discover</span>
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Nearby</span>
          </TabsTrigger>
          {/* <TabsTrigger value="saved" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>Saved</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discover Masjids</CardTitle>
              <CardDescription>
                Explore masjids from around the world.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MasjidsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nearby Masjids</CardTitle>
              <CardDescription>
                Find masjids close to your current location.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <MasjidMap />
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Masjids</CardTitle>
              <CardDescription>
                View your favorite and saved masjids.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SavedMasjids />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
