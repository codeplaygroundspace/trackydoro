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
  isHomePage?: boolean;
  showKeyboardShortcutsModal?: boolean;
  showSettingsModal?: boolean;
  onCloseKeyboardShortcuts?: () => void;
  onCloseSettings?: () => void;
}

export const AppLayout = ({
  children,
  showFooter = true,
  backgroundImage = '/img/wallpaper02.jpeg',
  className = '',
  onKeyboardShortcuts,
  onSettings,
  isHomePage = false,
  showKeyboardShortcutsModal = false,
  showSettingsModal = false,
  onCloseKeyboardShortcuts = () => {},
  onCloseSettings = () => {},
}: AppLayoutProps) => {
  const router = useRouter();

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
            <AppHeader isHomePage={isHomePage} />
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

        {/* Modals - only rendered on home page */}
        {isHomePage && (
          <>
            {/* Keyboard modal */}
            <Modal isOpen={showKeyboardShortcutsModal} onClose={onCloseKeyboardShortcuts}>
              <KeyboardShortcuts onClose={onCloseKeyboardShortcuts} />
            </Modal>

            {/* Settings modal */}
            <Modal isOpen={showSettingsModal} onClose={onCloseSettings}>
              <Settings onClose={onCloseSettings} />
            </Modal>
          </>
        )}
      </main>
    </>
  );
};
