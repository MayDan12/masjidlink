"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Upload } from "lucide-react";
import { auth } from "@/firebase/client";
import {
  getUsersProfile,
  updateProfile,
  uploadImage,
} from "@/app/(dashboards)/dashboard/profile/action";
import { toast } from "sonner";
import { useAuth } from "@/context/auth";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  profilePicture: z.string().optional(),
  location: z.string().optional(),
  bio: z
    .string()
    .max(500, {
      message: "Bio must not be longer than 500 characters.",
    })
    .optional(),
  skills: z.string().optional(),
  occupation: z.string().optional(),
  languages: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileInformation() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [userImage, setImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = user?.displayName;
  const email = user?.email;
  const initials = fullName
    ?.split(" ")
    .filter((word: string) => word)
    .map((word: string) => word[0])
    .join("");

  // Mock default values
  const defaultValues: Partial<ProfileFormValues> = {
    name: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    occupation: "",
    languages: "",
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    async function fetchUsersProfile() {
      try {
        const token = await auth?.currentUser?.getIdToken();
        if (!token) {
          throw new Error("User not authenticated");
        }
        const response = await getUsersProfile(token);
        if (response.error) {
          throw new Error(response.message);
        }
        if (response.success && response.data) {
          const userProfile = response.data;
          setImage(userProfile?.profilePicture);
          form.reset({
            name: userProfile?.name || "",
            phone: userProfile?.phone || "",
            location: userProfile?.location || "",
            bio: userProfile?.bio || "",
            skills: userProfile?.skills || "",
            occupation: userProfile?.occupation || "",
            languages: userProfile?.languages || "",
          });
        }
      } catch (error) {
        console.log("Error fetching user profile:", error);
      }
    }
    // Fetch user profile on component mount
    fetchUsersProfile();
  }, [form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.readAsDataURL(file);

      // Upload to server
      const token = await auth?.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadImage(formData, token);

      if (!response.success) throw new Error(response.message);
      await refreshUser();
      toast.success("Image uploaded successfully");
      setPreviewImage(response.imageUrl);
      // You might want to update the form with the new image URL
      form.setValue("profilePicture", response.imageUrl); // Adjust according to your form structure
      // or handle it in your onSubmit function
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Update your onSubmit function to include the image
  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) throw new Error("Not authenticated");

      // Include the image URL if available
      const profileData = {
        ...data,
        token,
      };

      // Call your update API
      const response = await updateProfile(profileData);
      if (!response.success) throw new Error(response.message);
      await refreshUser();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={previewImage || userImage}
              alt="Profile picture"
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
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
            Member since {new Date(2021, 5, 15).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="City, State" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Tell us about yourself"
                    className="resize-none min-h-[100px]"
                  />
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
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Separate skills with commas"
                    />
                  </FormControl>
                  <FormDescription>
                    Skills you&apos;d like to share with the community
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Separate languages with commas"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
