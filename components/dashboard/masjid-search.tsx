"use client";

import type React from "react";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

export function MasjidSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // In a real app, this would trigger a search API call
  };

  const handleLocationSearch = () => {
    console.log("Searching by current location");
    // In a real app, this would use the browser's geolocation API
    // and then search for masjids near that location
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search masjids..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleLocationSearch}
      >
        <MapPin className="h-4 w-4" />
        <span className="sr-only">Search by location</span>
      </Button>
    </form>
  );
}
