import { Clock3 } from '@/components/icons';
import { ThemeToggle } from '@/components/theme';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Gradient background */}
      <div className="fixed inset-0 bg-background">
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
      </div>
      
      <main className="flex-grow text-foreground p-4 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Clock3 className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-black text-foreground dark:text-primary tracking-wide">
                Trackydoro
              </h1>
            </Link>
            <ThemeToggle />
          </div>
          
          <div className="max-w-3xl mx-auto">

        {/* Terms Content */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pomofocus</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Terms and Conditions</h2>
          <p className="text-muted-foreground mb-8">Last Updated: September 8, 2023</p>

          <p className="text-muted-foreground mb-8">
            Please read these Terms and Conditions carefully before using our services.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Acceptance of Terms</h3>
          <p className="text-muted-foreground mb-6">
            By using the Pomofocus website, you agree to comply with and be bound by these Terms and Conditions.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Changes to Terms</h3>
          <p className="text-muted-foreground mb-6">
            We reserve the right to change, modify, or revise these Terms at any time. Any changes will become effective immediately upon being posted on this page.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Use of Pomofocus</h3>
          <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-2">
            <li>You may use Pomofocus for personal, non-commercial purposes.</li>
            <li>You may not reverse-engineer, decompile, or disassemble any part of the website.</li>
            <li>You may not use Pomofocus for any illegal activities.</li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h3>
          <p className="text-muted-foreground mb-8">
            In no event shall Pomofocus or its affiliates be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any unauthorized access to or use of our servers and/or any personal information stored therein.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Contact Us</h3>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Terms and Conditions, please contact us by sending email to:
          </p>
          <p className="text-muted-foreground mb-16">
            <a 
              href="mailto:support@pomofocus.io" 
              className="text-primary font-semibold hover:underline"
            >
              support@pomofocus.io
            </a>
          </p>

        </article>
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}