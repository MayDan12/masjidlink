export default function MasjidDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Masjid Details</h1>
          <p className="text-muted-foreground">
            View and manage details for the selected masjid.
            {id}
          </p>
        </div>
      </div>
    </div>
  );
}
