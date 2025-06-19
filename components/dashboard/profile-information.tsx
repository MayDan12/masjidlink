"use client";

import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import { auth } from "@/firebase/client";
import {
  getUsersProfile,
  updateProfile,
  uploadImage,
} from "@/app/(dashboards)/dashboard/profile/action";
import { useAuth } from "@/context/auth";

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
  location: z.string().optional(),
  bio: z
    .string()
    .max(500, { message: "Bio must not be longer than 500 characters." })
    .optional(),
  skills: z.string().optional(),
  occupation: z.string().optional(),
  languages: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileInformation() {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // Get image sources with priority: preview > Firebase Auth > Profile DB
  const displayImage = previewImage || user?.photoURL || profileImage;

  const { fullName, email, initials, joinDate } = useMemo(() => {
    const fullName = user?.displayName || "";
    const email = user?.email || "";
    const initials = fullName
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("");
    const joinDate = new Date(
      user?.metadata?.creationTime || Date.now()
    ).toLocaleDateString();

    return { fullName, email, initials, joinDate };
  }, [user]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
      skills: "",
      occupation: "",
      languages: "",
    },
  });

  // Fetch user profile
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("User not authenticated");

        const res = await getUsersProfile(token);
        if (!res.success || !res.data) throw new Error(res.message);

        if (isMounted) {
          setProfileImage(res.data.profilePicture || "");
          form.reset({
            name: res.data.name || "",
            phone: res.data.phone || "",
            location: res.data.location || "",
            bio: res.data.bio || "",
            skills: res.data.skills || "",
            occupation: res.data.occupation || "",
            languages: res.data.languages || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [form, user]); // Added user to dependencies

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        // Create preview
        const preview = URL.createObjectURL(file);
        setPreviewImage(preview);

        // Upload to server
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error("Not authenticated");

        const formData = new FormData();
        formData.append("image", file);

        const res = await uploadImage(formData, token);
        if (!res.success) throw new Error(res.message);

        // Update both Firebase Auth and local state
        await refreshUser(); // This will update user.photoURL
        setProfileImage(res.imageUrl); // Update profile image state
        form.setValue("profilePicture", res.imageUrl);

        toast.success("Profile picture updated successfully");
      } catch (err) {
        console.error("Image upload error:", err);
        toast.error("Failed to upload image");
        setPreviewImage(""); // Clear failed preview
      } finally {
        setIsUploading(false);
      }
    },
    [form, refreshUser]
  );

  const triggerFileInput = () => fileInputRef.current?.click();

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const res = await updateProfile({ ...data, token });
      if (!res.success) throw new Error(res.message);

      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={displayImage}
              alt={displayImage ? `Profile picture of ${fullName}` : ""}
              className="object-cover"
              onError={() => {
                // Fallback if image fails to load
                setPreviewImage("");
                setProfileImage("");
              }}
            />
            <AvatarFallback delayMs={600}>{initials}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            <span>{isUploading ? "Uploading..." : "Change Photo"}</span>
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium">{fullName}</h3>
          <p className="text-sm text-muted-foreground">{email}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Member since {joinDate}
          </p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="name" label="Full Name" control={form.control} />
            <Field name="phone" label="Phone Number" control={form.control} />
            <Field
              name="location"
              label="Location"
              control={form.control}
              placeholder="City, State"
            />
            <Field
              name="occupation"
              label="Occupation"
              control={form.control}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none min-h-[100px]" />
                </FormControl>
                <FormDescription>
                  Brief description that will be visible on your profile. Max
                  500 characters.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              name="skills"
              label="Skills"
              control={form.control}
              placeholder="Separate skills with commas"
              description="Skills you'd like to share with the community"
            />
            <Field
              name="languages"
              label="Languages"
              control={form.control}
              placeholder="Separate languages with commas"
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Reusable Field component remains the same

// ----------------------
// Reusable Field Component
// ----------------------
type FieldProps = {
  name: keyof ProfileFormValues;
  label: string;
  control: any;
  placeholder?: string;
  description?: string;
};

function Field({ name, label, control, placeholder, description }: FieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
