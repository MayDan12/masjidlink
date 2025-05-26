"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Save, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Facility = {
  id: string;
  name: string;
  available: boolean;
  details?: string;
};

export function MasjidFacilities() {
  const [isLoading, setIsLoading] = useState(false);
  const [newFacility, setNewFacility] = useState("");

  const [facilities, setFacilities] = useState<Facility[]>([
    {
      id: "1",
      name: "Prayer Hall",
      available: true,
      details: "Capacity: 500 people",
    },
    {
      id: "2",
      name: "Wudu Area",
      available: true,
      details: "Separate for men and women",
    },
    {
      id: "3",
      name: "Women's Section",
      available: true,
      details: "Dedicated space with audio/video",
    },
    {
      id: "4",
      name: "Library",
      available: true,
      details: "Islamic books and resources",
    },
    {
      id: "5",
      name: "Classrooms",
      available: true,
      details: "5 rooms for educational programs",
    },
    {
      id: "6",
      name: "Kitchen",
      available: true,
      details: "For community events",
    },
    {
      id: "7",
      name: "Parking",
      available: true,
      details: "100 spaces available",
    },
    { id: "8", name: "Wheelchair Access", available: true },
    { id: "9", name: "Funeral Services", available: false },
  ]);

  const handleToggleFacility = (id: string) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === id
          ? { ...facility, available: !facility.available }
          : facility
      )
    );
  };

  const handleUpdateDetails = (id: string, details: string) => {
    setFacilities(
      facilities.map((facility) =>
        facility.id === id ? { ...facility, details } : facility
      )
    );
  };

  const handleAddFacility = () => {
    if (newFacility.trim()) {
      setFacilities([
        ...facilities,
        {
          id: Date.now().toString(),
          name: newFacility.trim(),
          available: true,
        },
      ]);
      setNewFacility("");
    }
  };

  const handleDeleteFacility = (id: string) => {
    setFacilities(facilities.filter((facility) => facility.id !== id));
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Facilities updated",
        description:
          "Your masjid's facilities information has been successfully updated.",
      });
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Facilities</CardTitle>
        <CardDescription>
          Manage the facilities available at your masjid to help community
          members know what to expect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add a new facility..."
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleAddFacility} type="button">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          {facilities.map((facility) => (
            <div key={facility.id} className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`facility-${facility.id}`}
                    checked={facility.available}
                    onCheckedChange={() => handleToggleFacility(facility.id)}
                  />
                  <Label
                    htmlFor={`facility-${facility.id}`}
                    className={
                      facility.available
                        ? "font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {facility.name}
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteFacility(facility.id)}
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {facility.available && (
                <div className="pl-6">
                  <Input
                    placeholder="Add details about this facility (optional)"
                    value={facility.details || ""}
                    onChange={(e) =>
                      handleUpdateDetails(facility.id, e.target.value)
                    }
                    className="text-sm"
                  />
                </div>
              )}

              <Separator />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
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
    </Card>
  );
}
