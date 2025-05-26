import type React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <Button size="sm" className="h-9">
          <Bell className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </div>
    </div>
  );
}
