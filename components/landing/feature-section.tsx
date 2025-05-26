import {
  Bell,
  Calendar,
  ChurchIcon as Mosque,
  Clock,
  CreditCard,
  Smartphone,
  UserCog,
  UsersRound,
  Zap,
} from "lucide-react";

export function FeatureSection() {
  const features = [
    {
      icon: Clock,
      title: "Prayer Times",
      description:
        "Accurate prayer times based on your location with customizable calculation methods",
    },
    {
      icon: Bell,
      title: "Azan Notifications",
      description:
        "Receive timely reminders for prayers with customizable azan sounds",
    },
    {
      icon: Mosque,
      title: "Masjid Discovery",
      description:
        "Find and connect with masjids in your area, complete with ratings and reviews",
    },
    {
      icon: Calendar,
      title: "Community Events",
      description:
        "Stay updated on local events, Jumu'ah khutbahs, and Islamic classes",
    },
    {
      icon: UserCog,
      title: "Imam Dashboard",
      description:
        "Powerful tools for imams to manage masjid profiles, events, and more",
    },
    {
      icon: CreditCard,
      title: "Secure Donations",
      description: "Make and manage donations to your local masjid with ease",
    },
    {
      icon: UsersRound,
      title: "Community Building",
      description:
        "Connect with other Muslims in your area and strengthen community bonds",
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description:
        "Access MasjidLink on any device with our responsive web application",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description:
        "Built with modern technology for a seamless user experience",
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Comprehensive Features
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Everything you need to connect with your local masjid and community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
