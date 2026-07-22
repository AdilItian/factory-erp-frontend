# Table Filters — SQL-Style Filter Builder

Reusable, server-side, SQL-style filtering system used by EVERY data table in the app
(admin users, gigs, orders, proposals, payouts, disputes, …). One shared implementation —
tables only declare their filterable columns.

---

## 1. UX Flow (3-Step Wizard)

### Opening

- Each table toolbar has a **Filter** button (`Icons.filter` + active-filter count badge).
- Clicking opens a **Popover** (desktop) / **Sheet** (mobile) containing the wizard.

### Step 1 — Pick a field

- Searchable command list (shadcn `Command`) of the table's filterable columns.
- Each item: field icon (by data type), localized field label.
- Typing filters the list; Enter or click selects and advances to Step 2.

### Step 2 — Pick an operator

- Searchable list of operators **scoped to the selected field's data type** (see §3).
- Operators are **descriptive, human-readable, localized** — "contains", "is any of",
  "is on or after" — never raw SQL symbols (`>=`, `ILIKE`) in the UI.
- Selecting advances to Step 3. Operators that need no value (`is empty`, `is not empty`,
  `is true`, `is false`) skip Step 3 and apply immediately.

### Step 3 — Enter value(s)

Input is rendered **by data type + operator**:

| Data type    | Input                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| text         | Text input (debounced)                                                                                                  |
| number/money | Number input; **two inputs** (min/max) for `between`; money uses `FormMoneyField` conventions (integer cents)           |
| date         | Calendar picker; **range picker** for `between`; preset list for relative operators (today, last 7 days, this month, …) |
| enum/status  | Multi-select checklist with search (for `is any of` / `is none of`); options from enum constants + next-intl labels     |
| boolean      | No input (operator itself is the value)                                                                                 |
| user/entity  | Async searchable combobox (server-side search)                                                                          |

- **Apply** button confirms; **Back** returns to the previous step at any point.
- Breadcrumb header in the popover shows current position — e.g. `Status › is any of › …` —
  and **each breadcrumb segment is clickable** to jump back to that step (field re-pick
  resets operator/value; operator re-pick keeps field, resets value if incompatible).

### Applied filters as chips

- Each applied filter renders as a **chip** in the toolbar:
  `[ Status · is any of · Active, Delivered ✕ ]`
  (field label · operator label · formatted value — values truncated with `+N` when long).
- **Click chip → reopens the wizard for THAT filter in edit mode**, landing on Step 3 with
  breadcrumb navigation available to change field or operator too.
- `✕` on chip removes that filter. A **Clear all** chip appears when 2+ filters are active.
- Chips wrap to multiple rows; keyboard accessible (chip focusable, Enter = edit, Delete = remove).

### Combinator

- Default: all filters combined with **AND**.
- V2 (schema supports it from day one): AND/OR toggle between chips + grouped conditions.

---

## 2. State & URL (nuqs — URL is the source of truth)

Filters serialize into one search param, validated by Zod on read (server & client):

```
?filters=[{"id":"status","op":"in","v":["active","delivered"]},{"id":"price","op":"gte","v":5000}]
```

```ts
// src/components/data-table/filters/filter-schema.ts
export const filterConditionSchema = z.object({
  id: z.string(), // column id — MUST exist in the table's filter config
  op: z.enum(FILTER_OPERATORS_ALL),
  v: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.string()),
    z.array(z.number()),
    z.tuple([z.coerce.date(), z.coerce.date()]),
    z.null(),
  ]),
});
export const filtersSchema = z.array(filterConditionSchema).max(20);
```

- Client: `useQueryStates` (nuqs, `shallow: true`) — changing filters triggers React Query refetch
  (filters are part of the table's query key via the `QUERY_KEYS` factory).
- Server: `searchParamsCache` parses the same schema for prefetch.
- Invalid/unknown entries are silently dropped (never crash on a hand-edited URL).

---

## 3. Operator Matrix (per data type)

Operator IDs live in `src/constants/filter-operators.ts`; labels are next-intl keys
(`filters.operators.*`). UI labels below are the English values.

### text

| id            | UI label         | SQL (Drizzle)            |
| ------------- | ---------------- | ------------------------ |
| `contains`    | contains         | `ilike %v%`              |
| `notContains` | does not contain | `notIlike %v%`           |
| `eq`          | is exactly       | `eq`                     |
| `neq`         | is not           | `ne`                     |
| `startsWith`  | starts with      | `ilike v%`               |
| `endsWith`    | ends with        | `ilike %v`               |
| `isEmpty`     | is empty         | `isNull` or `eq('')`     |
| `isNotEmpty`  | is not empty     | `isNotNull` and `ne('')` |

### number / money

| id                       | UI label                 | SQL                    |
| ------------------------ | ------------------------ | ---------------------- |
| `eq`                     | equals                   | `eq`                   |
| `neq`                    | does not equal           | `ne`                   |
| `gt`                     | is greater than          | `gt`                   |
| `gte`                    | is greater than or equal | `gte`                  |
| `lt`                     | is less than             | `lt`                   |
| `lte`                    | is less than or equal    | `lte`                  |
| `between`                | is between               | `between`              |
| `isEmpty` / `isNotEmpty` | is empty / is not empty  | `isNull` / `isNotNull` |

(Money values entered in major units, converted to integer cents before serialization.)

### date

| id                       | UI label                | SQL                                                                                                             |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| `is`                     | is                      | day-range `between`                                                                                             |
| `before`                 | is before               | `lt`                                                                                                            |
| `after`                  | is after                | `gt`                                                                                                            |
| `onOrBefore`             | is on or before         | `lte`                                                                                                           |
| `onOrAfter`              | is on or after          | `gte`                                                                                                           |
| `between`                | is between              | `between`                                                                                                       |
| `relative`               | is within (presets)     | `gte NOW() - interval` — presets: today, yesterday, last 7 days, last 30 days, this week, this month, this year |
| `isEmpty` / `isNotEmpty` | is empty / is not empty | `isNull` / `isNotNull`                                                                                          |

### enum / status / multi-select

| id      | UI label   | SQL          |
| ------- | ---------- | ------------ |
| `in`    | is any of  | `inArray`    |
| `notIn` | is none of | `notInArray` |

### boolean

| id        | UI label | SQL              |
| --------- | -------- | ---------------- |
| `isTrue`  | is true  | `eq(col, true)`  |
| `isFalse` | is false | `eq(col, false)` |

### array columns (skills, tags — Postgres arrays)

| id       | UI label   | SQL               |
| -------- | ---------- | ----------------- |
| `hasAll` | has all of | `col @> ARRAY[v]` |
| `hasAny` | has any of | `col && ARRAY[v]` |

---

## 4. Per-Table Filter Config (declarative)

Each table declares filterable columns once — everything else is generic:

```ts
// src/features/orders/lib/orders-filter-config.ts
import { FILTER_TYPES } from "@/constants/filter-operators";

export const ordersFilterConfig: FilterConfig = {
  columns: [
    {
      id: "status",
      labelKey: "orders.fields.status",
      type: FILTER_TYPES.ENUM,
      options: ORDER_STATUS,
    },
    { id: "total", labelKey: "orders.fields.total", type: FILTER_TYPES.MONEY },
    {
      id: "createdAt",
      labelKey: "orders.fields.createdAt",
      type: FILTER_TYPES.DATE,
    },
    {
      id: "buyerName",
      labelKey: "orders.fields.buyer",
      type: FILTER_TYPES.TEXT,
    },
    {
      id: "sellerId",
      labelKey: "orders.fields.seller",
      type: FILTER_TYPES.ENTITY,
      search: searchSellers,
    },
  ],
};
```

This config drives Step 1's field list, Step 2's operator list, Step 3's input, chip
formatting, AND the server-side whitelist.

---

## 5. Server-Side WHERE Builder (security-critical)

One shared util converts validated conditions → Drizzle `where`:

```ts
// src/components/data-table/filters/build-where-clause.ts
export function buildWhereClause(
  conditions: FilterCondition[],
  columnMap: Record<string, PgColumn>, // WHITELIST: filter id → Drizzle column
): SQL | undefined {
  return and(
    ...conditions
      .map((c) => {
        const column = columnMap[c.id];
        if (!column) return undefined; // unknown column → dropped, never interpolated
        return OPERATOR_BUILDERS[c.op](column, c.v);
      })
      .filter(Boolean),
  );
}
```

Rules:

- **Column names are NEVER taken from user input** — only whitelist lookups (`columnMap`).
- Values only ever bind as parameters (Drizzle operators) — no raw SQL string interpolation.
- Zod-validate the `filters` param before building; enforce max 20 conditions.
- Every column in any filter config must have a DB index.

---

## 6. Component Architecture (kebab-case, ≤300 lines each)

```
src/components/data-table/filters/
├── filter-button.tsx            # toolbar trigger + count badge
├── filter-popover.tsx           # popover/sheet shell + wizard state machine (step, editingChipIndex)
├── filter-breadcrumb.tsx        # clickable step navigation header
├── steps/
│   ├── field-step.tsx           # step 1 — searchable field list
│   ├── operator-step.tsx        # step 2 — searchable operator list (scoped by type)
│   └── value-step.tsx           # step 3 — renders the right input per type/operator
├── inputs/
│   ├── text-filter-input.tsx
│   ├── number-filter-input.tsx  # handles single + between (min/max)
│   ├── money-filter-input.tsx
│   ├── date-filter-input.tsx    # calendar + range + relative presets
│   ├── multi-select-filter-input.tsx
│   └── entity-filter-input.tsx  # async combobox
├── filter-chips.tsx             # chip row + clear-all
├── filter-chip.tsx              # single chip (click=edit, ✕=remove, keyboard support)
├── use-filter-wizard.ts         # wizard state hook (step, draft condition, edit mode, navigation)
├── use-table-filters.ts         # nuqs read/write + Zod validation
├── filter-schema.ts             # Zod schemas + FilterCondition/FilterConfig types
├── build-where-clause.ts        # server-side (also imported by services)
└── chip-value-formatter.ts      # localized value display (dates, money, enums, +N truncation)
```

Integration: `data-table-toolbar.tsx` accepts a `filterConfig` prop and renders
`filter-button` + `filter-chips`. Tables opt in with one prop.

---

## 7. i18n & RTL

- Field labels, operator labels, presets, "Clear all", empty states — all next-intl keys
  (`filters.*` namespace) in `en/ur/ar.json`.
- Chips, popover, breadcrumb use logical properties (`ms-*`, `pe-*`, `text-start`);
  breadcrumb chevrons flip with `rtl:rotate-180`.
- Dates/money in chips formatted per locale via `Intl` (`chip-value-formatter.ts`).

---

## 8. Behavior Details & Edge Cases

- **Debounce**: text/number value inputs apply on button click (not per keystroke) —
  one clean URL update + one refetch per filter action.
- **Pagination reset**: applying/editing/removing a filter resets `page` to 1.
- **Duplicate filters**: same column may appear in multiple conditions (e.g., price ≥ 50 AND price ≤ 200).
- **Type changes on edit**: switching field in edit mode resets operator + value; switching
  operator keeps value only if compatible (e.g., `gt` → `gte` keeps it; `gt` → `between` resets).
- **Saved views (V2)**: named filter sets persisted per user per table (`saved_table_views` table).
- **Permissions**: filter configs can mark columns with a permission key — columns the user's
  CASL ability can't read are excluded from Step 1 AND stripped server-side.
- **Export respects filters**: CSV export (where permitted) uses the same `buildWhereClause`.
