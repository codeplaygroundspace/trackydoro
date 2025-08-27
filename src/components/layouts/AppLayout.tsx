'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useState } from 'react';

import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Settings } from '@/components/Settings';
import { KeyboardShortcuts, Modal } from '@/components/ui';

interface AppLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  backgroundImage?: string;
  className?: string;
  onKeyboardShortcuts?: () => void;
  onSettings?: () => void;
}

export const AppLayout = ({
  children,
  showFooter = true,
  backgroundImage = '/img/wallpaper02.jpeg',
  className = '',
  onKeyboardShortcuts,
  onSettings,
}: AppLayoutProps) => {
  const router = useRouter();
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <main className={`text-foreground relative ${className}`} role="main">
        {/* Background */}
        <div className="fixed inset-0 bg-background">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Header - Fixed at top */}
        <div className="relative z-10 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AppHeader
              onKeyboardClick={() => {
                setShowKeyboardShortcuts(true);
                onKeyboardShortcuts?.();
              }}
              onSettingsClick={() => {
                setShowSettings(true);
                onSettings?.();
              }}
              onAnalyticsClick={() => router.push('/analytics')}
            />
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10">{children}</div>

        {/* Footer section */}
        {showFooter && (
          <div className="relative z-10">
            <Footer />
          </div>
        )}

        {/* Keyboard modal */}
        <Modal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)}>
          <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
        </Modal>

        {/* Settings modal */}
        <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
          <Settings onClose={() => setShowSettings(false)} />
        </Modal>
      </main>
    </>
  );
};
