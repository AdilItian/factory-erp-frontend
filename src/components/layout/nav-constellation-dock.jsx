'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKBar } from 'kbar';
import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { navGroups } from '@/config/nav-config';
import { useFilteredNavGroups } from '@/hooks/use-nav';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BeaconTooltip, DockGroupMenu } from './nav-dock-flyouts';
import { dockBeaconClass, isItemActive } from './nav-dock-utils';

function DockBeacon({ item, groupLabel, index }) {
  const pathname = usePathname();
  const Icon = item.icon ? Icons[item.icon] : Icons.logo;
  const active = isItemActive(pathname, item);
  const hasChildren = Array.isArray(item.items) && item.items.length > 0;
  const hint =
    item.description ||
    (groupLabel ? `${groupLabel} · Open ${item.title}` : `Go to ${item.title}`);
  const beaconClass = cn(dockBeaconClass(active));

  const motionProps = {
    className: 'shrink-0',
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.04 * index, type: 'spring', stiffness: 380, damping: 28 }
  };

  if (hasChildren) {
    return (
      <motion.div {...motionProps}>
        <DropdownMenu>
          <DropdownMenuTrigger className={beaconClass} aria-label={`${item.title} menu`}>
            <Icon className='size-4' />
            <Icons.chevronUp className='absolute top-0.5 size-2.5 opacity-70' />
            {active ? (
              <span className='bg-primary-foreground absolute bottom-1 size-1 rounded-full' />
            ) : null}
          </DropdownMenuTrigger>
          <DockGroupMenu item={item} groupLabel={groupLabel} pathname={pathname} />
        </DropdownMenu>
      </motion.div>
    );
  }

  return (
    <motion.div {...motionProps}>
      <BeaconTooltip
        label={item.title}
        hint={hint}
        groupLabel={groupLabel}
        shortcut={item.shortcut}
        icon={Icon}
        active={active}
      >
        <Link
          href={item.url}
          aria-label={item.title}
          aria-current={active ? 'page' : undefined}
          className={beaconClass}
        >
          <Icon className='size-4' />
          {active ? (
            <span className='bg-primary-foreground absolute bottom-1 size-1 rounded-full' />
          ) : null}
        </Link>
      </BeaconTooltip>
    </motion.div>
  );
}

function CommandBeacon() {
  const { query } = useKBar();

  return (
    <motion.div
      className='shrink-0 px-0.5'
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.08, type: 'spring', stiffness: 420, damping: 24 }}
    >
      <BeaconTooltip
        label='Command palette'
        hint='Jump anywhere — search pages, actions, and shortcuts in one place.'
        groupLabel='Quick jump'
        icon={Icons.logo}
        accent
      >
        <button
          type='button'
          onClick={query.toggle}
          aria-label='Open command palette'
          className={cn(
            'relative flex size-11 shrink-0 items-center justify-center rounded-full',
            'bg-foreground text-background shadow-md',
            'transition-transform duration-200 hover:scale-[1.03]',
            'outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          )}
        >
          <span className='bg-background/15 absolute inset-1 rounded-full' />
          <Icons.logo className='relative size-4' />
        </button>
      </BeaconTooltip>
    </motion.div>
  );
}

export function NavConstellationDock() {
  const filteredGroups = useFilteredNavGroups(navGroups);
  const flatItems = filteredGroups.flatMap((group, groupIndex) =>
    group.items.map((item, itemIndex) => ({
      item,
      groupLabel: group.label,
      isGroupStart: itemIndex === 0 && groupIndex > 0
    }))
  );

  return (
    <nav
      aria-label='Primary'
      className='pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center overflow-visible px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]'
    >
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/65 to-transparent'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className={cn(
          'pointer-events-auto relative flex w-max max-w-[calc(100vw-1.5rem)] flex-nowrap items-center gap-1 overflow-visible',
          'rounded-full border border-border/70 bg-background/80 px-2 py-1.5 shadow-2xl backdrop-blur-xl',
          'supports-[backdrop-filter]:bg-background/65'
        )}
      >
        <div
          aria-hidden
          className='pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(120%_80%_at_50%_120%,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_55%)]'
        />

        <CommandBeacon />

        <div className='bg-border/70 mx-0.5 h-7 w-px shrink-0' aria-hidden />

        {flatItems.map(({ item, groupLabel, isGroupStart }, index) => (
          <div key={item.title} className='flex shrink-0 items-center gap-1'>
            {isGroupStart ? (
              <div className='bg-border/70 mx-0.5 h-7 w-px shrink-0' aria-hidden />
            ) : null}
            <DockBeacon item={item} groupLabel={groupLabel} index={index} />
          </div>
        ))}
      </motion.div>
    </nav>
  );
}
