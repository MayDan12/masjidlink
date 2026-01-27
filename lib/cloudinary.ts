interface CloudinaryUploadResponse {
  secure_url: string;
  // Add other fields you might need from Cloudinary response
}

export const uploadToCloudinary = async (
  file: File,
  folder?: string,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  // Add folder if provided
  if (folder) {
    formData.append("folder", `logistics/${folder}`);
  }

  // Fix for PDF upload with q_auto preset error
  // Use "raw" resource type for PDFs to bypass image transformations like q_auto
  const isPdf =
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PDF_UPLOAD_PRESET!,
    );
  } else {
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );
  }

  const resourceType = isPdf ? "raw" : "auto";

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    }/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  console.log("Upload request:", formData.get("upload_preset"));
  console.log(
    `https://api.cloudinary.com/v1_1/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    }/${resourceType}/upload`,
  );
  console.log("Upload response:", response);

  if (!response.ok) {
    const error = await response.text();
    console.error("Upload failed:", error);
    throw new Error(`Upload failed: ${error}`);
  }

  const data: CloudinaryUploadResponse = await response.json();
  console.log("Upload successful:", data.secure_url);
  return data.secure_url;
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  console.log("TODO: Implement delete", publicId);
  // Implementation for deletion if needed
  // Note: This requires server-side implementation with your Cloudinary secret key
};

export const getPublicIdFromUrl = (url: string): string | null => {
  // Extract public ID from Cloudinary URL
  const matches = url.match(/upload\/(?:v\d+\/)?(.+)\.[^/.]+$/);
  return matches ? matches[1] : null;
};
