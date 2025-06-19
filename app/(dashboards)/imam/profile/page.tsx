import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasjidProfileForm } from "@/components/imam-dashboard/masjid-profile-form";
import { MasjidMediaManager } from "@/components/imam-dashboard/masjid-media-manager";
import { MasjidContactInfo } from "@/components/imam-dashboard/masjid-contact-info";
// import { MasjidFacilities } from "@/components/imam-dashboard/masjid-facilities";

export default function MasjidProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Masjid Profile</h1>
        <p className="text-muted-foreground">
          Manage your masjid&apos;s information, photos, and facilities to help
          community members connect with you.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="media">Photos</TabsTrigger>
          <TabsTrigger value="contact">Socials</TabsTrigger>
          {/* <TabsTrigger value="facilities">Facilities</TabsTrigger> */}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <MasjidProfileForm />
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <MasjidMediaManager />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <MasjidContactInfo />
        </TabsContent>

        {/* <TabsContent value="facilities" className="space-y-4">
          <MasjidFacilities />
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
