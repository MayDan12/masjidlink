"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "../landing/file-upload";
import { auth } from "@/firebase/client";
import { uploadMasjidImage } from "@/app/(dashboards)/imam/profile/action";
import { Loader2 } from "lucide-react";

export default function UploadForm() {
  const [imageName, setImageName] = useState("");
  const [imageType, setImageType] = useState("");
  const [masjidImage, setMasjidImage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!masjidImage) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!imageName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for the image.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically handle the form submission
    // For example, using FormData to send to your API
    const formData = new FormData();
    formData.append("file", masjidImage);
    formData.append("name", imageName);
    formData.append("type", imageType);

    const token = await auth?.currentUser?.getIdToken();
    if (!token) {
      throw new Error("User not authenticated");
    }

    // Call the uploadMasjidImage action
    const response = await uploadMasjidImage({
      imageUrl: masjidImage,
      name: imageName,
      type: imageType,
      token: token,
    });

    if (response.error) {
      toast({
        title: "Upload failed",
        description: response.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Upload successful",
      description: `Uploaded ${masjidImage}`,
    });

    // Reset form
    setLoading(false);
    setMasjidImage("");
    setImageName("");
    setImageType("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
        <div className="">
          <FileUpload
            label="Masjid Image"
            onChange={setMasjidImage}
            value={masjidImage}
            accept="image/*"
          />
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              You can upload images in any category. You can also delete them
              later.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-name">Image Name</Label>
                <Input
                  id="image-name"
                  type="text"
                  placeholder="Name of the Picture e.g, Classroom"
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                  required
                />
              </div>

              {/* Lets make this a select dropdown */}

              <div className="space-y-2">
                <Label htmlFor="image-type">Image Type</Label>
                <select
                  id="image-type"
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                  className="w-full p-2 border border-input bg-background text-foreground"
                >
                  <option value="">Select Image Type</option>
                  <option value="exterior">Exterior</option>
                  <option value="interior">Interior</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {/* Whgat a day it is */}

              <Button type="submit" className="w-full">
                {loading ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
