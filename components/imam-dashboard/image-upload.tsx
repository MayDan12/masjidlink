"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlus, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

export default function UploadForm() {
  const [imageName, setImageName] = useState("");
  const [imageType, setImageType] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      // Validate file types and sizes
      const validFiles = filesArray.filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        );
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported format. Please use JPEG, PNG, or WebP.`,
            variant: "destructive",
          });
        }

        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            variant: "destructive",
          });
        }

        return isValidType && isValidSize;
      });

      setSelectedFiles(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      // Validate file types and sizes
      const validFiles = filesArray.filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        );
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported format. Please use JPEG, PNG, or WebP.`,
            variant: "destructive",
          });
        }

        if (!isValidSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            variant: "destructive",
          });
        }

        return isValidType && isValidSize;
      });

      setSelectedFiles(validFiles);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload.",
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
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("name", imageName);
    formData.append("type", imageType);

    // Example submission (commented out)
    // const response = await fetch('/api/upload', {
    //   method: 'POST',
    //   body: formData,
    // })

    toast({
      title: "Upload successful",
      description: `Uploaded ${selectedFiles.length} image(s)`,
    });

    // Reset form
    setSelectedFiles([]);
    setImageName("");
    setImageType("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0">
        <div
          className={`flex items-center justify-center border-2 border-dashed rounded-lg p-8 md:p-12 bg-muted/50 ${
            isDragging ? "border-primary" : "border-primary/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drag and drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported formats: JPEG, PNG, WebP. Max file size: 5MB
              </p>
            </div>
            <Button type="button" onClick={handleButtonClick}>
              <ImagePlus className="mr-2 h-4 w-4" />
              Upload Images
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2 text-sm text-primary">
                {selectedFiles.length} file(s) selected
              </div>
            )}
          </div>
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

              <div className="space-y-2">
                <Label htmlFor="image-type">Image Type</Label>
                <Input
                  id="image-type"
                  type="text"
                  placeholder="Type of the Picture e.g, Interior"
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
