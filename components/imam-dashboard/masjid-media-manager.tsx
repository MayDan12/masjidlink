"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";
import UploadForm from "./image-upload";
import Image from "next/image";
import { auth } from "@/firebase/client";
import { getMasjidImages } from "@/app/(dashboards)/imam/profile/action";

type ImageType = {
  id: string;
  imageUrl: string;
  name: string;
  type: "Exterior" | "Interior" | "Events" | "Other";
};

export function MasjidMediaManager() {
  const [images, setImages] = useState<ImageType[]>([]);

  // Get images array
  const getImages = async () => {
    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      throw new Error("User not authenticated");
    }
    const response = await getMasjidImages(token);
    if (response.error) {
      throw new Error(response.message);
    }
    setImages(response.data || []);
  };

  useEffect(() => {
    getImages();
  }, []);

  const [selectedTab, setSelectedTab] = useState<string>("all");

  const filteredImages =
    selectedTab === "all"
      ? images
      : images.filter((image) => image.type === selectedTab);

  const handleDelete = (id: string) => {
    setImages(images.filter((image) => image.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>
          Upload and manage photos of your masjid to showcase your facilities
          and events.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <UploadForm />

        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="exterior">Exterior</TabsTrigger>
            <TabsTrigger value="interior">Interior</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative border rounded-lg overflow-hidden"
                >
                  <Image
                    src={image.imageUrl || "/placeholder.svg"}
                    alt={image.name}
                    className="w-full h-48 object-cover"
                    width={300}
                    height={200}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <div className="p-3 bg-background">
                    <p className="font-medium truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {image.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-muted/50">
                <p className="text-muted-foreground">
                  No images found in this category.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          {images.length} images in total
        </p>
        <Button variant="outline">Manage Categories</Button>
      </CardFooter>
    </Card>
  );
}
