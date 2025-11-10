import type { ReactNode } from 'react';
import Header from '@/components/Header';

type PageLayoutProps = {
  children: ReactNode;
  mainClassName?: string;
};

export const PageLayout = ({
  children,
  mainClassName = 'container mx-auto px-4 py-8',
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className={mainClassName}>{children}</main>
    </div>
  );
};
