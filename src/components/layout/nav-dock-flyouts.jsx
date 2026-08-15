'use client';

import Link from 'next/link';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import {
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatShortcut, isChildActive } from './nav-dock-utils';

const flyoutClass =
  'z-[60] overflow-hidden rounded-2xl border p-0 text-left shadow-2xl bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-200';

function FlyoutGlow({ accent = false }) {
  return (
    <>
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
    </>
  );
}

function FlyoutIcon({ icon: Icon, active = false, accent = false }) {
  const Resolved = Icon || Icons.logo;
  return (
    <div
      className={cn(
        'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-xs',
        accent
          ? 'bg-foreground text-background border-foreground'
          : active
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-secondary text-secondary-foreground border-border/80'
      )}
    >
      <Resolved
        className={cn(
          'size-4',
          accent
            ? 'text-background'
            : active
              ? 'text-primary-foreground'
              : 'text-secondary-foreground'
        )}
      />
    </div>
  );
}

export function BeaconTooltip({
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
      <TooltipTrigger nativeButton={false}>{children}</TooltipTrigger>
      <TooltipContent
        side='top'
        sideOffset={14}
        showArrow={false}
        className={cn(flyoutClass, 'w-[220px]')}
      >
        <div className='relative overflow-hidden px-3.5 pt-3.5 pb-3'>
          <FlyoutGlow accent={accent} />
          <div className='relative flex items-start gap-3'>
            <FlyoutIcon icon={Icon} active={active} accent={accent} />
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

function GroupMenuRow({ item, siblings, pathname }) {
  const Icon = item.icon ? Icons[item.icon] : Icons.logo;
  const active = isChildActive(pathname, item, siblings);
  const shortcutLabel = formatShortcut(item.shortcut);

  return (
    <DropdownMenuItem
      render={<Link href={item.url} aria-label={item.title} />}
      className={cn(
        'items-start gap-3 rounded-xl p-2',
        active && 'bg-primary/10 text-foreground focus:bg-primary/15'
      )}
    >
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-xl border shadow-xs',
          active
            ? 'bg-primary border-primary'
            : 'bg-secondary border-border/80'
        )}
      >
        <Icon
          className={cn(
            'size-4',
            active ? 'text-primary-foreground' : 'text-secondary-foreground'
          )}
        />
      </div>
      <div className='min-w-0 flex-1 space-y-0.5'>
        <div className='flex items-center gap-1.5'>
          <p className='truncate text-sm leading-tight font-semibold tracking-tight'>{item.title}</p>
          {active ? (
            <span className='bg-primary/15 text-primary rounded-md px-1.5 py-0.5 text-[9px] font-semibold tracking-wide uppercase'>
              Here
            </span>
          ) : null}
        </div>
        {item.description ? (
          <p className='text-muted-foreground line-clamp-2 text-[11px] leading-relaxed'>
            {item.description}
          </p>
        ) : null}
      </div>
      {shortcutLabel ? (
        <kbd className='bg-muted text-muted-foreground mt-1 inline-flex shrink-0 items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium'>
          {shortcutLabel}
        </kbd>
      ) : null}
    </DropdownMenuItem>
  );
}

export function DockGroupMenu({ item, groupLabel, pathname }) {
  const Icon = item.icon ? Icons[item.icon] : Icons.logo;
  const children = item.items ?? [];

  return (
    <DropdownMenuContent
      side='top'
      align='center'
      sideOffset={14}
      className={cn(flyoutClass, 'w-[268px]')}
    >
      <div className='relative overflow-hidden px-3.5 pt-3.5 pb-2.5'>
        <FlyoutGlow />
        <div className='relative flex items-start gap-3'>
          <FlyoutIcon icon={Icon} />
          <div className='min-w-0 flex-1 space-y-1.5'>
            {groupLabel ? (
              <span className='text-muted-foreground rounded-md border px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase'>
                {groupLabel}
              </span>
            ) : null}
            <p className='text-sm leading-tight font-semibold tracking-tight'>{item.title}</p>
            {item.description ? (
              <p className='text-muted-foreground text-[11px] leading-relaxed'>{item.description}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className='space-y-0.5 p-1.5 pt-0'>
        {children.map((subItem) => (
          <GroupMenuRow
            key={subItem.title}
            item={subItem}
            siblings={children}
            pathname={pathname}
          />
        ))}
      </div>
    </DropdownMenuContent>
  );
}
