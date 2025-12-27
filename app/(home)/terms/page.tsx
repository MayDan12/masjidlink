import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-3 text-muted-foreground">
          Please read these terms carefully. By using MasjidLink, you agree to
          these Terms of Service.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-6">
          <section>
            <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
            <p className="text-muted-foreground mt-2">
              By accessing or using MasjidLink, you agree to be bound by these
              Terms. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Accounts</h2>
            <p className="text-muted-foreground mt-2">
              You are responsible for maintaining the confidentiality of your
              account and for all activities under your account. Provide
              accurate information and promptly update any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Use of Service</h2>
            <p className="text-muted-foreground mt-2">
              Use MasjidLink in accordance with applicable laws and respectful
              community standards. Do not misuse the platform, attempt to
              interfere with operations, or submit harmful content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              Imam and Masjid Responsibilities
            </h2>
            <p className="text-muted-foreground mt-2">
              Imams and masjid leaders managing profiles should ensure
              information is accurate and appropriate. Manage events, prayer
              times, and campaigns responsibly and comply with local
              regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Donations</h2>
            <p className="text-muted-foreground mt-2">
              Donations are processed via integrated payment services.
              MasjidLink is not responsible for tax treatment or receipts unless
              explicitly provided. Verify campaigns before donating.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Content</h2>
            <p className="text-muted-foreground mt-2">
              You retain rights to content you submit and grant MasjidLink a
              limited license to display and operate the service. Do not submit
              content that violates rights or laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Privacy</h2>
            <p className="text-muted-foreground mt-2">
              Your use of MasjidLink is also governed by our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Disclaimers</h2>
            <p className="text-muted-foreground mt-2">
              MasjidLink is provided on an “as is” and “as available” basis. We
              make no warranties regarding accuracy, reliability, or
              availability of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Limitation of Liability</h2>
            <p className="text-muted-foreground mt-2">
              To the fullest extent permitted by law, MasjidLink shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Changes to Terms</h2>
            <p className="text-muted-foreground mt-2">
              We may update these Terms from time to time. Continued use after
              changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground mt-2">
              Questions about these Terms? Visit{" "}
              <Link href="/contact" className="underline">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
