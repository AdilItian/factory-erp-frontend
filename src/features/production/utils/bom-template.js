import { getEntityId, getEntityName, refId } from '@/lib/entity';

export function formatQty(value) {
  if (!Number.isFinite(value)) return '0';
  const rounded = Math.round(value * 1000) / 1000;
  return String(rounded);
}

/** Scale template lines (per baseQty) up to a target finished-good quantity. */
export function scaleTemplateLines(template, outputQty) {
  const base = Number(template?.baseQty ?? 1) || 1;
  const target = Number(outputQty) || 0;
  const factor = target / base;

  return (template?.lines ?? []).map((line) => ({
    id: crypto.randomUUID(),
    itemId: line.itemId,
    item: line.item ?? null,
    quantity: formatQty(Number(line.quantity) * factor),
    scrapPercent: line.scrapPercent || '0',
    workCenterId: line.workCenterId || ''
  }));
}

export function valuesFromTemplateApply(template, outputQty = '1') {
  if (!template) return null;
  const qty = String(outputQty || '1');
  return {
    code: '',
    name: `${getEntityName(template)} · ${qty} pc`,
    itemId: refId(template.itemId) || refId(template.item),
    version: '1',
    outputQty: qty,
    isActive: true,
    templateId: getEntityId(template),
    lines: scaleTemplateLines(template, qty)
  };
}
