export function findByBarcode(items = [], barcode) {
  const needle = String(barcode ?? '').trim();
  if (!needle) return null;
  return (
    items.find(
      (item) => String(item.barcode ?? '').trim().toLowerCase() === needle.toLowerCase()
    ) ?? null
  );
}

export function matchesPosSearch(item, query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return true;
  const haystack = [item.code, item.name, item.barcode]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(q);
}

export function formatMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

export function cartSubtotal(lines = []) {
  return lines.reduce((sum, line) => {
    const qty = Number(line.quantity) || 0;
    const price = Number(line.unitPrice) || 0;
    return sum + qty * price;
  }, 0);
}

/**
 * @param {Array} lines
 * @param {string|number} discountValue
 * @param {'amount'|'percent'} discountType
 */
export function cartTotals(lines = [], discountValue = 0, discountType = 'amount') {
  const subtotal = cartSubtotal(lines);
  const raw = Math.max(0, Number(discountValue) || 0);
  const discount =
    discountType === 'percent'
      ? Math.min(subtotal, (subtotal * Math.min(raw, 100)) / 100)
      : Math.min(subtotal, raw);
  const rounded = Math.round(discount * 100) / 100;
  const total = Math.max(0, Math.round((subtotal - rounded) * 100) / 100);
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: rounded,
    discountPercent: discountType === 'percent' ? Math.min(raw, 100) : null,
    discountType,
    total
  };
}

export function upsertCartLine(lines, item, delta = 1) {
  const existing = lines.find((line) => line.itemId === item.id);
  if (existing) {
    const nextQty = Number(existing.quantity) + delta;
    if (nextQty <= 0) {
      return lines.filter((line) => line.itemId !== item.id);
    }
    return lines.map((line) =>
      line.itemId === item.id
        ? { ...line, quantity: String(nextQty) }
        : line
    );
  }
  if (delta <= 0) return lines;
  return [
    ...lines,
    {
      id: crypto.randomUUID(),
      itemId: item.id,
      item,
      quantity: String(delta),
      unitPrice: String(item.retailPrice ?? '0')
    }
  ];
}

export function setCartLineQty(lines, itemId, quantity) {
  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0) {
    return lines.filter((line) => line.itemId !== itemId);
  }
  return lines.map((line) =>
    line.itemId === itemId ? { ...line, quantity: String(qty) } : line
  );
}
