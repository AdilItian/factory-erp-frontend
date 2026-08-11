'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import SearchInput from '@/components/search-input';
import { ThemeSelector } from '@/components/themes/theme-selector';
import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';
import { NotificationCenter } from '@/features/notifications/components/notification-center';
import { UserNav } from '@/components/layout/user-nav';
import { cn } from '@/lib/utils';

export default function Header() {
  return (
    <header
      className={cn(
        'bg-background/55 sticky top-0 z-30 shrink-0 backdrop-blur-xl',
        'border-b border-border/50'
      )}
    >
      <div className='flex h-14 items-center justify-between gap-3 px-4 md:px-6'>
        <Link
          href='/dashboard/overview'
          className='group flex min-w-0 items-center gap-2.5'
          aria-label='Company OS home'
        >
          <span className='bg-foreground text-background relative flex size-8 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105'>
            <Icons.logo className='size-3.5' />
            <span className='bg-background/20 absolute inset-1 rounded-lg' />
          </span>
          <span className='min-w-0'>
            <span className='block truncate text-sm font-semibold tracking-tight'>
              Company OS
            </span>
            <span className='text-muted-foreground hidden text-[10px] tracking-[0.16em] uppercase sm:block'>
              Mission control
            </span>
          </span>
        </Link>

        <div className='flex items-center gap-1.5 sm:gap-2'>
          <div className='hidden md:block'>
            <SearchInput />
          </div>
          <ThemeModeToggle />
          <div className='hidden sm:block'>
            <ThemeSelector />
          </div>
          <NotificationCenter />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
