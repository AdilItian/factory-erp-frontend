/**
 * Derives columnPinning initialState from column definitions.
 * Any column with meta.pin = 'left' | 'right' is auto-pinned.
 *
 * Usage:
 *   const { table } = useDataTable({
 *     ...
 *     initialState: { columnPinning: getPinningState(columns) },
 *   });
 */
export function getPinningState(columns) {
  const left = [];
  const right = [];

  for (const col of columns) {
    const pin = col.meta?.pin;
    const id = col.id ?? col.accessorKey;
    if (!id) continue;
    if (pin === 'left') left.push(id);
    if (pin === 'right') right.push(id);
  }

  return { left, right };
}
