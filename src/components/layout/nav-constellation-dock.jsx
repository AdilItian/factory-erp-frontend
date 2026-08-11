'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKBar } from 'kbar';
import { motion } from 'motion/react';
import { Icons } from '@/components/icons';
import { navGroups } from '@/config/nav-config';
import { useFilteredNavGroups } from '@/hooks/use-nav';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

function isRouteActive(pathname, url) {
  if (!url) return false;
  if (pathname === url) return true;
  return pathname.startsWith(`${url}/`);
}

function formatShortcut(shortcut) {
  if (!Array.isArray(shortcut) || shortcut.length === 0) return null;
  return shortcut.map((key) => String(key).toUpperCase()).join(' then ');
}

function BeaconTooltip({
  label,
  hint,
  groupLabel,
  shortcut,
  icon: Icon,
  active = false,
  accent = false,
  children
}) {
  const shortcutLabel = formatShortcut(shortcut);

  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent
        side='top'
        sideOffset={14}
        showArrow={false}
        className={cn(
          'z-[60] w-[220px] overflow-hidden rounded-2xl border p-0 text-left shadow-2xl',
          'bg-popover text-popover-foreground',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200'
        )}
      >
        <div className='relative overflow-hidden px-3.5 pt-3.5 pb-3'>
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute -top-10 -right-8 size-28 rounded-full blur-2xl',
              accent ? 'bg-foreground/15' : 'bg-primary/20'
            )}
          />
          <div
            aria-hidden
            className='pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent'
          />

          <div className='relative flex items-start gap-3'>
            <div
              className={cn(
                'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-xs',
                accent
                  ? 'bg-foreground text-background border-foreground'
                  : active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/80 text-foreground border-border/80'
              )}
            >
              {Icon ? <Icon className='size-4' /> : <Icons.logo className='size-4' />}
            </div>

            <div className='min-w-0 flex-1 space-y-1.5'>
              <div className='flex flex-wrap items-center gap-1.5'>
                {groupLabel ? (
                  <span className='text-muted-foreground rounded-md border px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase'>
                    {groupLabel}
                  </span>
                ) : null}
                {active ? (
                  <span className='bg-primary/15 text-primary rounded-md px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase'>
                    Here
                  </span>
                ) : null}
              </div>

              <p className='text-sm leading-tight font-semibold tracking-tight'>{label}</p>

              {hint ? (
                <p className='text-muted-foreground text-[11px] leading-relaxed'>{hint}</p>
              ) : null}

              {shortcutLabel || accent ? (
                <div className='flex items-center gap-1.5 pt-0.5'>
                  {shortcutLabel ? (
                    <kbd className='bg-muted text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium'>
                      {shortcutLabel}
                    </kbd>
                  ) : null}
                  {accent ? (
                    <kbd className='bg-muted text-muted-foreground inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium'>
                      ⌘K
                    </kbd>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function DockBeacon({ item, groupLabel, index }) {
  const pathname = usePathname();
  const Icon = item.icon ? Icons[item.icon] : Icons.logo;
  const active = isRouteActive(pathname, item.url);
  const hasChildren = Array.isArray(item.items) && item.items.length > 0;
  const hint =
    item.description ||
    (groupLabel ? `${groupLabel} · Open ${item.title}` : `Go to ${item.title}`);

  const beaconClass = cn(
    'relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
    'outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    active
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  );

  const tooltipProps = {
    label: item.title,
    hint,
    groupLabel,
    shortcut: item.shortcut,
    icon: Icon,
    active
  };

  if (hasChildren) {
    return (
      <motion.div
        className='shrink-0'
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 * index, type: 'spring', stiffness: 380, damping: 28 }}
      >
        <DropdownMenu>
          <BeaconTooltip {...tooltipProps}>
            <DropdownMenuTrigger className={beaconClass} aria-label={item.title}>
              <Icon className='size-4' />
              {active ? (
                <span className='bg-primary-foreground absolute bottom-1 size-1 rounded-full' />
              ) : null}
            </DropdownMenuTrigger>
          </BeaconTooltip>
          <DropdownMenuContent side='top' align='center' sideOffset={14} className='min-w-44'>
            {item.items.map((subItem) => (
              <DropdownMenuItem
                key={subItem.title}
                render={<Link href={subItem.url} />}
              >
                {subItem.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    );
  }

  return (
    <motion.div
      className='shrink-0'
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, type: 'spring', stiffness: 380, damping: 28 }}
    >
      <BeaconTooltip {...tooltipProps}>
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
            <DockBeacon
              item={item}
              groupLabel={groupLabel}
              index={index}
            />
          </div>
        ))}
      </motion.div>
    </nav>
  );
}
