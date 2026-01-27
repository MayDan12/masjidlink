"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { UploadCloud, FileText } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";
import Image from "next/image";

interface FileUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  accept?: string;
  disabled?: boolean;
}

export function FileUpload({
  label = "Upload file",
  value,
  onChange,
  folder,
  className,
  accept = "*",
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Generate unique ID for each component instance
  const uniqueId = `file-upload-${Math.random().toString(36).slice(2, 9)}`;

  // Show toast
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "error",
  ) => {
    toast[type](message);
  };

  // Validate and upload file
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let isAccepted = false;

    // Accept any file
    if (accept === "*" || accept === "*/*") {
      isAccepted = true;
    }

    // Accept all images
    else if (accept.includes("image/*") && file.type.startsWith("image/")) {
      isAccepted = true;
    }

    // Accept extensions like .pdf,.doc
    else {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const allowedExtensions = accept
        .split(",")
        .map((ext) => ext.trim().replace(".", "").toLowerCase());

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        isAccepted = true;
      }
    }

    if (!isAccepted) {
      showToast(`Invalid file type. Allowed: ${accept}`, "error");
      return;
    }

    // Size check: 5MB
    if (file.size > 5 * 1024 * 1024) {
      showToast("File too large. Max size is 5MB", "error");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file, folder);
      onChange(url);
      showToast("File uploaded successfully", "success");
    } catch (err) {
      console.error("Upload error:", err);
      showToast("Upload failed. Try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const isImage = value ? /\.(jpg|jpeg|png|gif|webp)$/i.test(value) : false;

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label htmlFor={uniqueId}>{label}</Label>}

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            id={uniqueId}
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept={accept}
            disabled={disabled || isUploading}
          />

          <Label
            htmlFor={uniqueId}
            className={cn(
              "flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6",
              "transition-colors hover:bg-accent/50",
              disabled && "cursor-not-allowed opacity-50",
              isUploading && "cursor-wait opacity-70",
            )}
          >
            <UploadCloud className="mb-2 h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isUploading
                ? "Uploading..."
                : "Click to upload or drag and drop"}
            </span>
            <span className="text-xs text-muted-foreground">
              {accept.includes("*") ? "Any file type" : `Allowed: ${accept}`}
            </span>
          </Label>
        </div>

        {/* Preview */}
        {value && (
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-gray-50">
            {isImage ? (
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-xs text-blue-600 underline"
              >
                <FileText className="h-6 w-6 text-blue-500" />
                View
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
