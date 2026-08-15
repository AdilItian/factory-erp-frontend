export function isRouteActive(pathname, url) {
  if (!url) return false;
  if (pathname === url) return true;
  return pathname.startsWith(`${url}/`);
}

export function isChildActive(pathname, child, siblings = []) {
  if (!child?.url) return false;
  if (pathname === child.url) return true;

  const hasMoreSpecificSibling = siblings.some(
    (sibling) => sibling.url && sibling.url !== child.url && sibling.url.startsWith(`${child.url}/`)
  );

  if (hasMoreSpecificSibling) return false;
  return pathname.startsWith(`${child.url}/`);
}

export function isItemActive(pathname, item) {
  const children = item.items ?? [];
  if (children.length > 0) {
    return children.some((child) => isChildActive(pathname, child, children));
  }
  return isRouteActive(pathname, item.url);
}

export function formatShortcut(shortcut) {
  if (!Array.isArray(shortcut) || shortcut.length === 0) return null;
  return shortcut.map((key) => String(key).toUpperCase()).join(' then ');
}

export function dockBeaconClass(active) {
  return [
    'relative flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200',
    'outline-none focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'data-popup-open:bg-muted data-popup-open:text-foreground',
    active
      ? 'bg-primary text-primary-foreground shadow-sm'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  ];
}
