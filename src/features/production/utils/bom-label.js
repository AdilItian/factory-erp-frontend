import { getEntityName } from '@/lib/entity';

export function lineUnit(line) {
  return line.item?.uom?.code || line.uom?.code || '';
}

export function formatBomLine(line) {
  const qty = line.quantity ?? line.qty ?? '';
  const unit = lineUnit(line);
  const name = getEntityName(line.item, line.item?.code || 'Component');
  const scrap = Number(line.scrapPercent);
  const scrapBit =
    Number.isFinite(scrap) && scrap > 0 ? ` (+${scrap}% scrap)` : '';
  return [qty, unit, name].filter(Boolean).join(' ') + scrapBit;
}

export function formatRecipeLines(lines = []) {
  if (!lines.length) return 'No components yet';
  return lines.map(formatBomLine).join(' · ');
}
