import KBar from '@/components/kbar';
import Header from '@/components/layout/header';
import { InfoSidebar } from '@/components/layout/info-sidebar';
import { NavConstellationDock } from '@/components/layout/nav-constellation-dock';
import { InfobarProvider } from '@/components/ui/infobar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn',
  robots: {
    index: false,
    follow: false
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <KBar>
      <div className='bg-background relative flex min-h-svh flex-col'>
        <Header />
        <InfobarProvider defaultOpen={false}>
          <div className='relative flex min-w-0 flex-1 flex-col pb-28'>{children}</div>
          <InfoSidebar side='right' />
        </InfobarProvider>
        <NavConstellationDock />
      </div>
    </KBar>
  );
}
