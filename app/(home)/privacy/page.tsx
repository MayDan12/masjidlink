import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">
          This Privacy Policy explains how MasjidLink collects, uses, and protects your information.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-6">
          <section>
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p className="text-muted-foreground mt-2">
              We collect information you provide when creating an account, updating your profile, following masjids, and participating in events or donations. We also collect limited technical data such as device, browser, and approximate location used to calculate prayer times and show nearby masjids.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">How We Use Information</h2>
            <p className="text-muted-foreground mt-2">
              We use your information to provide core features: prayer times, azan notifications, masjid discovery, community events, and donations. We also use information to improve the platform, maintain security, and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Location and Notifications</h2>
            <p className="text-muted-foreground mt-2">
              If you enable location, we use your approximate location to compute accurate prayer times and show nearby masjids. If you enable notifications, we send azan reminders and relevant updates. You can disable these at any time in your device or browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Cookies</h2>
            <p className="text-muted-foreground mt-2">
              We use cookies to authenticate users and maintain session state. Some cookies are essential for the service to function. You can manage cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Data Sharing</h2>
            <p className="text-muted-foreground mt-2">
              We do not sell your personal information. We may share limited data with service providers to operate features such as authentication, media storage, and payments. These providers are bound by contractual obligations to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-muted-foreground mt-2">
              We implement reasonable safeguards to protect your information. No system can be fully secure, and we encourage you to use strong passwords and keep your device secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Your Choices</h2>
            <p className="text-muted-foreground mt-2">
              You can update your profile, adjust notification and privacy preferences, and delete your account. To request data access or deletion, contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Children</h2>
            <p className="text-muted-foreground mt-2">
              MasjidLink is not directed to children under 13. If you believe we have collected data from a child, contact us to remove it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground mt-2">
              For privacy questions, visit{" "}
              <Link href="/contact" className="underline">
                Contact
              </Link>{" "}
              or email support.
            </p>
          </section>

          <section className="border-t pt-6">
            <p className="text-muted-foreground">
              See also{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
