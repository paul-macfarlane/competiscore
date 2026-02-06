import { LegalNav } from "@/components/legal-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Competiscore",
  description:
    "Privacy Policy for Competiscore - Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <LegalNav currentPage="privacy" />
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>
      <p className="mb-8 text-muted-foreground">
        Last Updated: February 4, 2026
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Competiscore. We respect your privacy and are committed
            to protecting your personal data. This privacy policy explains how
            we collect, use, store, and protect your information when you use
            our competition tracking platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.1 Information You Provide
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Account Information:</strong> When you sign up using
              Google or Discord authentication, we collect your email address,
              name, and profile picture from your chosen authentication
              provider.
            </li>
            <li>
              <strong>Profile Information:</strong> Username, display name
              (first and last name), profile picture, and optional bio.
            </li>
            <li>
              <strong>League Data:</strong> League names, descriptions,
              memberships, and roles.
            </li>
            <li>
              <strong>Competition Data:</strong> Match results, scores,
              rankings, tournament participation, and season standings.
            </li>
            <li>
              <strong>Team Data:</strong> Team names, logos, memberships, and
              performance records.
            </li>
            <li>
              <strong>User-Generated Content:</strong> Any content you create
              such as game type configurations, tournament structures, or
              reports submitted through our moderation system.
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            2.2 Automatically Collected Information
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Session Data:</strong> Authentication cookies required to
              maintain your login session.
            </li>
            <li>
              <strong>Server Logs:</strong> Our hosting provider (Vercel)
              collects standard server logs including IP addresses, request
              times, and URLs accessed for infrastructure, security, and
              troubleshooting purposes.
            </li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            We do not use analytics tracking, advertising cookies, or collect
            detailed usage behavior beyond what is necessary to provide the
            Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our competition tracking service</li>
            <li>Authenticate your account and manage access</li>
            <li>
              Calculate rankings, standings, and ELO ratings for competitions
            </li>
            <li>
              Enable you to participate in leagues, matches, tournaments, and
              seasons
            </li>
            <li>Display your profile and statistics to other league members</li>
            <li>
              Send you notifications about league activity and invitations
            </li>
            <li>Enforce our Terms of Service and community guidelines</li>
            <li>Improve our service and develop new features</li>
            <li>Respond to your support requests and communications</li>
            <li>
              Process future payments for Pro tier subscriptions (when
              available)
            </li>
            <li>
              Comply with legal obligations and protect against fraud or abuse
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Information Sharing and Disclosure
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.1 Within Leagues
          </h3>
          <p>
            Your profile information, match history, and statistics are visible
            to other members of the same leagues you belong to. Your profile is
            not visible to users outside your leagues.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            4.2 Third-Party Services
          </h3>
          <p>We share data with third-party services that help us operate:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Authentication Providers:</strong> Google and Discord for
              OAuth authentication
            </li>
            <li>
              <strong>Hosting and Infrastructure:</strong> Cloud service
              providers for hosting our application and database
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active
            or as needed to provide you services. If you delete your account:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Your personally identifying information (name, email, profile
              picture, bio) is permanently deleted
            </li>
            <li>
              Your match history, rankings, and statistics are preserved and
              displayed as &quot;Deleted User&quot; to maintain league data
              integrity
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Your Rights and Choices
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of the personal data we
              hold about you
            </li>
            <li>
              <strong>Correction:</strong> Update or correct your profile
              information at any time through your account settings
            </li>
            <li>
              <strong>Deletion:</strong> Delete your account, which will remove
              your personally identifying information
            </li>
            <li>
              <strong>Data Portability:</strong> Request a copy of your data in
              a machine-readable format (future feature)
            </li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us using the information in
            the Contact section below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration,
            disclosure, or destruction. These measures include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encryption of data in transit using HTTPS</li>
            <li>Secure authentication via trusted OAuth providers</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls limiting who can view personal data</li>
            <li>Audit logs for match recordings and administrative actions</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the internet is 100% secure.
            While we strive to protect your data, we cannot guarantee absolute
            security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            8. Cookies and Tracking
          </h2>
          <p>
            We use essential cookies and similar technologies to authenticate
            users, remember preferences, and maintain session state. We do not
            currently use third-party tracking or advertising cookies. You can
            control cookies through your browser settings, but disabling cookies
            may affect functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new Privacy Policy on
            this page and updating the &quot;Last Updated&quot; date. Your
            continued use of Competiscore after changes are posted constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <p className="mt-4">
            <strong>Email:</strong> competiscore@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
