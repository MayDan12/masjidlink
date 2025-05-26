"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  getMasjidProfile,
  saveMasjidProfile,
} from "@/app/(dashboards)/imam/profile/action";
import { auth } from "@/firebase/client";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Masjid name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code is required.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  establishedYear: z.string().optional(),
  capacity: z.string().optional(),
  denomination: z.string().optional(),
  facilityTypes: z.array(z.string()).min(3, {
    message: "Select at least one facility type.",
  }),
});

const FACILITY_TYPES = [
  "Prayer Hall",
  "Ablution Area",
  "Women's Section",
  "Library",
  "Classroom",
  "Conference Room",
  "Dining Hall",
  "Playground",
  "Parking",
  "Residential Quarters",
  "Office Space",
  "Outdoor Area",
  "Community Center",
  "Health Services",
  "Youth Center",
  "Elderly Care",
];

export function MasjidProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      description: "",
      establishedYear: "",
      capacity: "",
      denomination: "",
      facilityTypes: [],
    },
  });

  useEffect(() => {
    const fetchMasjidProfile = async () => {
      try {
        const token = await auth?.currentUser?.getIdToken();
        if (!token) {
          toast("Error", {
            description: "Unable to retrieve authentication token.",
          });
          return;
        }

        const response = await getMasjidProfile(token);

        if (response.success && response.data) {
          const data = response.data;
          if (!data) {
            toast("No Data", {
              description: "No social media data found.",
            });
            return;
          }

          form.reset({
            name: data.name || "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zipCode || "",
            country: data.country || "",
            description: data.description || "",
            establishedYear: data.establishedYear || "",
            capacity: data.capacity || "",
            denomination: data.denomination || "",
            facilityTypes: data.facilityTypes || [],
          });
        } else {
          toast("Error", {
            description: "Failed to fetch masjid profile.",
          });
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast("Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    };

    fetchMasjidProfile();
  }, [form]);

  // Initialize form with default values

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        toast("Error", {
          description: "Unable to retrieve authentication token.",
        });
        return;
      }

      const response = await saveMasjidProfile({ ...data, token });

      if (response.success) {
        toast("Saved Successfully", {
          description: "Masjid profile saved successfully.",
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
      } else {
        toast("Error", {
          description: response.message || "An error occurred while saving.",
        });
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast("Error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Masjid Information</CardTitle>
        <CardDescription>
          Update your masjid&apos;s basic information that will be displayed to
          the community.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masjid Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter masjid name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State/Province</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip/Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter zip code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description of your masjid"
                      className="min-h-[120px] resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description of your masjid, its history, and
                    services.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="establishedYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Established Year</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1985" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="denomination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Denomination</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select denomination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sunni">Sunni</SelectItem>
                        <SelectItem value="Shia">Shia</SelectItem>
                        <SelectItem value="Salafi">Salafi</SelectItem>
                        <SelectItem value="Sufi">Sufi</SelectItem>
                        <SelectItem value="Non-denominational">
                          Non-denominational
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="facilityTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Types</FormLabel>
                      <FormDescription>
                        Select all the facilities available at your masjid.
                      </FormDescription>
                      <div className="relative">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value.length && "text-muted-foreground"
                                )}
                              >
                                {field.value.length > 0
                                  ? `${field.value.length} facility types selected`
                                  : "Select facility types"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search facility type..." />
                              <CommandEmpty>
                                No facility type found.
                              </CommandEmpty>
                              <CommandGroup>
                                <ScrollArea className="h-60">
                                  {FACILITY_TYPES.map((type) => (
                                    <CommandItem
                                      key={type}
                                      value={type}
                                      onSelect={() => {
                                        const newValue = field.value.includes(
                                          type
                                        )
                                          ? field.value.filter(
                                              (item) => item !== type
                                            )
                                          : [...field.value, type];
                                        field.onChange(newValue);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value.includes(type)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {type}
                                    </CommandItem>
                                  ))}
                                </ScrollArea>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {field.value.map((type) => (
                            <Badge
                              key={type}
                              variant="secondary"
                              className="text-sm"
                            >
                              {type}
                              <button
                                type="button"
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => {
                                  field.onChange(
                                    field.value.filter((item) => item !== type)
                                  );
                                }}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
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
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
