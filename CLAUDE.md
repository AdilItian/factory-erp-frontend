# CLAUDE.md

This is a Next.js 16 + shadcn/ui admin dashboard starter kit.

## Key References

- **[AGENTS.md](./AGENTS.md)** — Full project overview, tech stack, structure, conventions, data fetching patterns, deployment
- **[docs/forms.md](./docs/forms.md)** — Form system: TanStack Form + Zod, composable fields, validation, multi-step, sheet/dialog forms
- **[docs/themes.md](./docs/themes.md)** — Theme system: OKLCH colors, adding themes, font config
- **[docs/nav-rbac.md](./docs/nav-rbac.md)** — Navigation RBAC: access control

## File Convention

- **All new files must be `.js` or `.jsx`** — never `.ts` or `.tsx`. No type annotations. Existing TypeScript files are not to be converted unless explicitly asked.
- **300-line limit per `.jsx` file** — if a component exceeds 300 lines, split it into smaller sub-components before submitting. No `.jsx` file should ever be opened in a PR with more than 300 lines of code.

## TanStack Query Feature Structure

Every feature's API layer lives under `src/tanstack/<feature-name>/` with exactly three files:

```
src/tanstack/
└── <feature-name>/
    ├── endpoints.js   ← API endpoint strings for this feature
    ├── queries.js     ← useQuery / useSuspenseQuery hooks
    └── mutations.js   ← useMutation hooks
```

**Rules:**
- One folder per feature (e.g. `auth`, `users`, `products`)
- `endpoints.js` holds all URL constants — never hardcode URLs inside queries or mutations. All endpoints live in the **global** `src/lib/api-endpoints.js` — import from there, never create a local endpoints file per feature
- Query keys for every feature live in the **global** `src/lib/query-keys.js` — add a `featureKeys` object there, never create a local `query-keys.js` per feature
- `queries.js` imports from `endpoints.js` and the appropriate axios client (`userServiceClient` or `coreServiceClient`)
- `mutations.js` imports from `endpoints.js` and the appropriate axios client
- Components import hooks from `queries.js` / `mutations.js` only — never call axios directly from a component

## Form Rules (enforced before every PR)

- **Every form must use `react-hook-form`** with either `zod` or `yup` validation via `@hookform/resolvers`. Plain `useState` forms are not allowed.
- **Every form must use the `FormBuilder` component** located at `src/components/ui/form-builder.jsx`. Pass an array of field config objects — never build form fields manually in page/feature components.
- **Long / multi-section forms** must use React Context (`FormContext`) to share form state across sub-components instead of prop-drilling. Create a `<FeatureFormProvider>` that wraps the form and exposes `useFormContext()` to children.
- **Field config object shape:**
  ```js
  { name: 'email', label: 'Email', type: 'email', placeholder: '...', validation: zodSchema }
  ```
  Supported types: `text`, `email`, `password`, `number`, `select`, `textarea`, `checkbox`
- **Toast feedback** — handle `onSuccess` and `onError` at the call site (in the component), not inside the mutation definition. Call `toast.success(...)` / `toast.error(...)` from `sonner` there.
- **LoadingButton** — use `LoadingButton` from `@/components/ui/loading-button.jsx` for every form submit button and every action bound to a mutation. Never use a plain `<Button>` for submit/mutation actions. Pass `isLoading={isPending}` and an optional `loadingText` prop.

## Theme (enforced on every new file or component)

- **Always use shadcn/ui + Tailwind semantic tokens** — never hardcode colors (`text-gray-500`, `bg-white`, `border-gray-200`). Use tokens like `text-muted-foreground`, `bg-card`, `bg-background`, `border`, `text-foreground`, `text-primary`, `text-destructive`, etc.
- **Spacing, radius, and shadow** must use Tailwind utility classes that respect the design system (`rounded-xl`, `shadow-sm`, `p-4`, `gap-4`) — no inline styles.
- **Dark mode is automatic** via the token system — never write `dark:` overrides manually unless absolutely unavoidable.
- **Typography** — use semantic classes (`text-2xl font-bold tracking-tight` for headings, `text-sm text-muted-foreground` for descriptions) consistent with the rest of the dashboard.
- **Reusable UI components** — always use existing shadcn/ui primitives before writing custom markup. Common ones: `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from `@/components/ui/table` for tabular data; `Card`, `CardHeader`, `CardContent` from `@/components/ui/card` for grouped content; `Badge` from `@/components/ui/badge` for status labels; `Dialog`, `Sheet` from their respective `@/components/ui/` paths for overlays. Never build these from scratch with raw `<div>` and `<table>` tags.

## Critical Conventions

- **React Query** for all data fetching — `void prefetchQuery()` on server + `useSuspenseQuery` on client (standard TanStack pattern), `useMutation` for forms, `HydrationBoundary` + `dehydrate` for hydration, `<Suspense fallback>` for streaming
- **API layer** per feature — `api/types.ts` → `api/service.ts` → `api/queries.ts`; queries use key factories (`entityKeys.all/list/detail`); components import from service and queries, never from mock APIs directly
- **nuqs** for URL search params — `searchParamsCache` on server, `useQueryStates` on client, use `getSortingStateParser` for sort (same parser as `useDataTable`)
- **Icons** — only import from `@/components/icons`, never from `@tabler/icons-react` directly
- **Forms** — use `useAppForm` + `useFormFields<T>()` from `@/components/ui/tanstack-form`
- **Page headers** — use `PageContainer` props (`pageTitle`, `pageDescription`, `pageHeaderAction`), never import `<Heading>` manually
- **Formatting** — single quotes, JSX single quotes, no trailing comma, 2-space indent
