import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main background */}
      <div className="fixed inset-0 bg-background"></div>

      <main className="flex-grow text-foreground p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          <PageHeader />
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-gray dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
              <p className="text-muted-foreground mb-8">Effective date: July 24, 2025</p>

              <p className="text-muted-foreground mb-6">
                Trackydoro (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;) operates the
                https://trackydoro.vercel.app website (hereinafter referred to as the
                &quot;Service&quot;).
              </p>

              <p className="text-muted-foreground mb-6">
                This page informs you of our policies regarding the collection, use, and disclosure
                of personal data when you use our Service and the choices you have associated with
                that data.
              </p>

              <p className="text-muted-foreground mb-8">
                We use your data to provide and improve the Service. By using the Service, you agree
                to the collection and use of information in accordance with this policy. Unless
                otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have
                the same meanings as in our Terms and Conditions, accessible from
                https://trackydoro.vercel.app
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
                Information Collection And Use
              </h2>
              <p className="text-muted-foreground mb-6">
                We collect several different types of information for various purposes to provide
                and improve our Service to you.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-4">
                Types of Data Collected
              </h3>

              <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Personal Data</h4>
              <p className="text-muted-foreground mb-6">
                While using our Service, we may ask you to provide us with certain personally
                identifiable information that can be used to identify you. Personally identifiable
                information may include, but is not limited to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6">
                <li>Cookies and Usage Data</li>
              </ul>

              <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Usage Data</h4>
              <p className="text-muted-foreground mb-6">
                We may also collect information on how the Service is accessed and used (&quot;Usage
                Data&quot;). This Usage Data may include information such as your computer&apos;s
                Internet Protocol address (e.g. IP address), browser type, browser version, the
                pages of our Service that you visit, the time and date of your visit, the time spent
                on those pages, unique device identifiers and other diagnostic data.
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">
                Tracking & Cookies Data
              </h4>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar tracking technologies to track the activity on our
                Service and hold certain information.
              </p>

              <p className="text-muted-foreground mb-4">
                Cookies are files with small amount of data which may include an anonymous unique
                identifier. Cookies are sent to your browser from a website and stored on your
                device. Tracking technologies also used are beacons, tags, and scripts to collect
                and track information and to improve and analyze our Service.
              </p>

              <p className="text-muted-foreground mb-4">
                You can instruct your browser to refuse all cookies or to indicate when a cookie is
                being sent. However, if you do not accept cookies, you may not be able to use some
                portions of our Service. You can learn more how to manage cookies in the Browser
                Cookies Guide.
              </p>

              <p className="text-muted-foreground mb-2">Examples of Cookies we use:</p>
              <ul className="list-disc list-inside text-muted-foreground mb-8">
                <li>Session Cookies. We use Session Cookies to operate our Service.</li>
                <li>
                  Preference Cookies. We use Preference Cookies to remember your preferences and
                  various settings.
                </li>
                <li>Security Cookies. We use Security Cookies for security purposes.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Use of Data</h2>
              <p className="text-muted-foreground mb-4">
                Trackydoro uses the collected data for various purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8">
                <li>To provide and maintain the Service</li>
                <li>To notify you about changes to our Service</li>
                <li>
                  To allow you to participate in interactive features of our Service when you choose
                  to do so
                </li>
                <li>To provide customer care and support</li>
                <li>
                  To provide analysis or valuable information so that we can improve the Service
                </li>
                <li>To monitor the usage of the Service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Transfer Of Data</h2>
              <p className="text-muted-foreground mb-4">
                Your information, including Personal Data, may be transferred to — and maintained on
                — computers located outside of your state, province, country or other governmental
                jurisdiction where the data protection laws may differ than those from your
                jurisdiction.
              </p>

              <p className="text-muted-foreground mb-4">
                If you are located outside Japan and choose to provide information to us, please
                note that we transfer the data, including Personal Data, to Japan and process it
                there.
              </p>

              <p className="text-muted-foreground mb-4">
                Your consent to this Privacy Policy followed by your submission of such information
                represents your agreement to that transfer.
              </p>

              <p className="text-muted-foreground mb-8">
                Trackydoro will take all steps reasonably necessary to ensure that your data is
                treated securely and in accordance with this Privacy Policy and no transfer of your
                Personal Data will take place to an organization or a country unless there are
                adequate controls in place including the security of your data and other personal
                information.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
                Disclosure Of Data
              </h2>

              <h3 className="text-xl font-semibold text-foreground mt-6 mb-4">
                Legal Requirements
              </h3>
              <p className="text-muted-foreground mb-4">
                Trackydoro may disclose your Personal Data in the good faith belief that such action
                is necessary to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-8">
                <li>To comply with a legal obligation</li>
                <li>To protect and defend the rights or property of Trackydoro</li>
                <li>
                  To prevent or investigate possible wrongdoing in connection with the Service
                </li>
                <li>To protect the personal safety of users of the Service or the public</li>
                <li>To protect against legal liability</li>
              </ul>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Security Of Data</h2>
              <p className="text-muted-foreground mb-8">
                The security of your data is important to us, but remember that no method of
                transmission over the Internet, or method of electronic storage is 100% secure.
                While we strive to use commercially acceptable means to protect your Personal Data,
                we cannot guarantee its absolute security.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
                Service Providers
              </h2>
              <p className="text-muted-foreground mb-4">
                We may employ third party companies and individuals to facilitate our Service
                (&quot;Service Providers&quot;), to provide the Service on our behalf, to perform
                Service-related services or to assist us in analyzing how our Service is used.
              </p>

              <p className="text-muted-foreground mb-8">
                These third parties have access to your Personal Data only to perform these tasks on
                our behalf and are obligated not to disclose or use it for any other purpose.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
                Advertising Partners
              </h2>
              <p className="text-muted-foreground mb-8">
                We work with third-party advertising partners to show you ads. Some of our
                advertising partners may use cookies and similar technologies to collect information
                about you when you use our service. For more information about how these partners
                may use your data, please see the Freestar Privacy Policy.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">
                Changes To This Privacy Policy
              </h2>
              <p className="text-muted-foreground mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any
                changes by posting the new Privacy Policy on this page.
              </p>

              <p className="text-muted-foreground mb-4">
                We will let you know via email and/or a prominent notice on our Service, prior to
                the change becoming effective and update the &quot;effective date&quot; at the top
                of this Privacy Policy.
              </p>

              <p className="text-muted-foreground mb-8">
                You are advised to review this Privacy Policy periodically for any changes. Changes
                to this Privacy Policy are effective when they are posted on this page.
              </p>

              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-8">
                If you have any questions about this Privacy Policy, please contact us
              </p>
            </article>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
