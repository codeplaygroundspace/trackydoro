import Link from 'next/link';

import { Clock3 } from '@/components/icons';

export default function PageHeader() {
  return (
    <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Clock3 className="w-6 h-6 text-primary" />
        <h1 className="text-lg font-black text-foreground dark:text-primary tracking-wide">
          Trackydoro
        </h1>
      </Link>
    </div>
  );
}
