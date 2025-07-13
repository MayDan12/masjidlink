import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MasjidDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="">
          <Link
            href="/dashboard/masjids"
            className="flex gap-2 justify-center items-center"
          >
            <ArrowLeft size={50} className="w-20 h-20" />
            <span>Back</span>
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Masjid Details</h1>
        <p className="text-muted-foreground">
          View and manage details for the selected masjid.
          {id}
        </p>
      </div>
    </div>
  );
}
