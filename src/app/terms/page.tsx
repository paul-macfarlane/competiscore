import { LegalNav } from "@/components/legal-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Competiscore",
  description:
    "Terms of Service for Competiscore - Rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <LegalNav currentPage="terms" />
      <h1 className="mb-8 text-4xl font-bold">Terms of Service</h1>
      <p className="mb-8 text-muted-foreground">
        Last Updated: February 4, 2026
      </p>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            Welcome to Competiscore! These Terms of Service (&quot;Terms&quot;)
            govern your access to and use of Competiscore&apos;s website,
            services, and applications (collectively, the &quot;Service&quot;).
            By accessing or using our Service, you agree to be bound by these
            Terms. If you do not agree to these Terms, you may not use the
            Service.
          </p>
          <p className="mt-4">
            These Terms constitute a legally binding agreement between you and
            Competiscore. We may modify these Terms at any time, and your
            continued use of the Service after changes are posted constitutes
            acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Description of Service
          </h2>
          <p>
            Competiscore is a web-based platform for tracking competitions,
            games, matches, tournaments, and seasons within leagues. The Service
            allows you to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and join leagues for competitive tracking</li>
            <li>Record match results and scores</li>
            <li>Track rankings, standings, and ELO ratings</li>
            <li>Organize tournaments and seasons</li>
            <li>Form teams and compete individually or as groups</li>
            <li>View statistics and performance history</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            3. Accounts and Registration
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            3.1 Account Creation
          </h3>
          <p>
            To use the Service, you must create an account by authenticating
            with a supported third-party provider (Google or Discord). You agree
            to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Be responsible for all activity under your account</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            3.2 Account Termination
          </h3>
          <p>
            You may delete your account at any time through your account
            settings. Upon deletion, your personally identifying information
            will be permanently removed, but your match history and statistics
            will be preserved as &quot;Deleted User&quot; to maintain league
            data integrity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            4. Acceptable Use Policy
          </h2>
          <p>You agree NOT to use the Service to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Violate any applicable laws, regulations, or third-party rights
            </li>
            <li>
              Submit false, fraudulent, or misleading match results or scores
            </li>
            <li>Harass, abuse, threaten, or intimidate other users</li>
            <li>
              Spam, advertise, or promote products or services without
              authorization
            </li>
            <li>
              Impersonate another person or entity, or misrepresent your
              affiliation
            </li>
            <li>
              Attempt to gain unauthorized access to the Service or other
              users&apos; accounts
            </li>
            <li>
              Interfere with or disrupt the Service or servers or networks
              connected to the Service
            </li>
            <li>
              Use automated tools (bots, scrapers) to access the Service without
              permission
            </li>
            <li>Upload or transmit viruses, malware, or any harmful code</li>
            <li>
              Collect or harvest personal information about other users without
              consent
            </li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. User-Generated Content
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Your Content</h3>
          <p>
            You retain ownership of any content you submit to the Service,
            including match results, scores, profile information, league
            descriptions, and team information (&quot;User Content&quot;). By
            submitting User Content, you grant Competiscore a worldwide,
            non-exclusive, royalty-free license to use, store, display, and
            distribute your User Content as necessary to provide and improve the
            Service.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            5.2 Content Responsibility
          </h3>
          <p>
            You are solely responsible for your User Content. You represent and
            warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You own or have the necessary rights to submit the content</li>
            <li>
              Your content does not violate any laws or third-party rights
            </li>
            <li>Your content is accurate and not misleading</li>
            <li>
              Your content does not contain viruses, malware, or harmful code
            </li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            5.3 Content Removal
          </h3>
          <p>
            We reserve the right to remove any User Content that violates these
            Terms or is otherwise objectionable, without notice. However, we are
            not obligated to monitor or review User Content.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Leagues, Teams, and Roles
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            6.1 League Creation and Management
          </h3>
          <p>
            Users may create leagues and manage them according to the role-based
            permissions system (Member, Manager, Executive). League creators and
            Executives have broad administrative powers including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Managing member roles and permissions</li>
            <li>Removing members from the league</li>
            <li>Archiving or deleting the league</li>
            <li>Creating and managing tournaments and seasons</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            6.2 Team Management
          </h3>
          <p>
            Users may create teams within leagues. Team creators and Managers
            have administrative powers over their teams, including managing
            membership and team details.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            6.3 Placeholder Members
          </h3>
          <p>
            Leagues may create placeholder members representing individuals who
            have not yet joined the Service. Placeholder members can only exist
            in one league and can only be claimed by one real user. When a user
            claims a placeholder, they inherit that placeholder&apos;s match
            history.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Match Recording and Data Integrity
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            7.1 Match Immutability
          </h3>
          <p>
            Recorded matches cannot be deleted or edited. This ensures
            historical data integrity and prevents manipulation of standings.
            All match recordings are auditable (who recorded what, when).
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            7.2 Accurate Reporting
          </h3>
          <p>
            You agree to record match results accurately and honestly.
            Submitting false or fraudulent match results violates these Terms
            and may result in account suspension or termination.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            7.3 Moderation and Reporting
          </h3>
          <p>
            Members may report other members for unsportsmanlike conduct, false
            match reporting, harassment, spam, or other violations. League
            Managers and Executives have remediation powers including warnings,
            suspensions, and removal of members.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            8. Usage Limits and Pro Tier
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            8.1 Free Tier Limits
          </h3>
          <p>The free tier of the Service includes the following limits:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Up to 3 leagues per user (as creator or member)</li>
            <li>Up to 20 active members per league</li>
            <li>Up to 20 game types per league</li>
          </ul>
          <p className="mt-4">
            Placeholder members do not count toward the active member limit.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            8.2 Future Pro Tier
          </h3>
          <p>
            A paid Pro tier will be introduced in the future, offering unlimited
            leagues, members, and game types, along with priority support and
            additional features. Pricing and exact features will be announced
            before launch.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            8.3 Administrative Overrides
          </h3>
          <p>
            Competiscore may grant administrative overrides to usage limits for
            specific users or leagues at its discretion (e.g., early adopters,
            promotional purposes, or special partnerships).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            9. Disclaimers and Limitations of Liability
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">9.1 No Warranty</h3>
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
            AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. COMPETISCORE
            DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE,
            OR SECURE.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            9.2 Third-Party Content
          </h3>
          <p>
            The Service may contain links to third-party websites or integrate
            with third-party services (such as authentication providers).
            Competiscore is not responsible for the content, accuracy, or
            practices of third-party sites or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Suspension and Termination
          </h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            10.1 Termination by You
          </h3>
          <p>
            You may stop using the Service and delete your account at any time
            through your account settings.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            10.2 Termination by Competiscore
          </h3>
          <p>
            We reserve the right to suspend or terminate your account and access
            to the Service at any time, with or without cause, with or without
            notice. Reasons for termination may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violation of these Terms or our Acceptable Use Policy</li>
            <li>Fraudulent or illegal activity</li>
            <li>Prolonged inactivity</li>
            <li>At our discretion for any other reason</li>
          </ul>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            10.3 Effect of Termination
          </h3>
          <p>
            Upon termination, your right to access and use the Service
            immediately ceases. Sections of these Terms that by their nature
            should survive termination (including indemnification, limitations
            of liability, and dispute resolution) will remain in effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            11. Changes to These Terms
          </h2>
          <p>
            We may modify these Terms at any time. If we make material changes,
            we will notify you by posting the updated Terms on this page and
            updating the &quot;Last Updated&quot; date. Your continued use of
            the Service after changes are posted constitutes your acceptance of
            the modified Terms.
          </p>
          <p className="mt-4">
            If you do not agree to the modified Terms, you must stop using the
            Service and delete your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Miscellaneous</h2>

          <h3 className="text-xl font-semibold mb-3 mt-6">
            12.1 Entire Agreement
          </h3>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire
            agreement between you and Competiscore regarding the Service.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Severability</h3>
          <p>
            If any provision of these Terms is found to be invalid or
            unenforceable, the remaining provisions will remain in full force
            and effect.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">12.3 Waiver</h3>
          <p>
            No waiver of any term of these Terms shall be deemed a further or
            continuing waiver of such term or any other term.
          </p>

          <h3 className="text-xl font-semibold mb-3 mt-6">12.4 Assignment</h3>
          <p>
            You may not assign or transfer these Terms or your account without
            our prior written consent. We may assign these Terms without
            restriction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            13. Contact Information
          </h2>
          <p>If you have questions about these Terms, please contact us at:</p>
          <p className="mt-4">
            <strong>Email:</strong> competiscore@gmail.com
          </p>
        </section>

        <section className="mt-12 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            By using Competiscore, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Service.
          </p>
        </section>
      </div>
    </div>
  );
}
