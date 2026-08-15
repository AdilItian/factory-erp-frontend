'use client';

import FormBuilder from '@/components/ui/form-builder';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

const SECTION_ICONS = {
  post: Icons.post,
  kanban: Icons.kanban,
  user: Icons.user,
  settings: Icons.settings,
  location: Icons.location,
  warehouse: Icons.warehouse,
  factory: Icons.factory,
  package: Icons.package,
  phone: Icons.phone,
  sitemap: Icons.sitemap,
  ruler: Icons.ruler,
  tags: Icons.tags,
  boxes: Icons.boxes,
  category: Icons.category,
  inventory: Icons.inventory,
  production: Icons.production,
  workCenter: Icons.workCenter,
  bom: Icons.bom,
  bomTemplate: Icons.bomTemplate,
  gatePass: Icons.gatePass,
  supplier: Icons.supplier,
  purchaseOrder: Icons.purchaseOrder,
  customer: Icons.customer,
  salesOrder: Icons.salesOrder,
  refund: Icons.refund,
  mrn: Icons.mrn,
  min: Icons.min,
  transfer: Icons.transfer,
  materialReturn: Icons.materialReturn,
  pos: Icons.pos
};

export const SOFT_LABEL_CLASS =
  'text-muted-foreground text-[11px] font-medium tracking-[0.12em] uppercase';
export const SOFT_FIELD_CLASS =
  'h-10 rounded-xl border-border/70 bg-background/80 shadow-none focus-visible:ring-primary/20';
export const SOFT_SELECT_CLASS =
  'h-10 w-full rounded-xl border-border/70 bg-background/80 shadow-none';
export const SOFT_TEXTAREA_CLASS =
  'min-h-28 rounded-xl border-border/70 bg-background/80 shadow-none focus-visible:ring-primary/20';

export function styleField(field) {
  const isSelect = field.type === 'select' || field.type === 'date';
  const isTextarea = field.type === 'textarea';
  const fallback = isTextarea
    ? SOFT_TEXTAREA_CLASS
    : isSelect
      ? SOFT_SELECT_CLASS
      : SOFT_FIELD_CLASS;

  return {
    ...field,
    labelClassName: field.labelClassName ?? SOFT_LABEL_CLASS,
    className: field.className ?? fallback
  };
}

export function FormIntro({ eyebrow, title, description }) {
  return (
    <div className='relative overflow-hidden rounded-2xl border'>
      <div className='from-primary/10 via-background to-background absolute inset-0 bg-gradient-to-br' />
      <div className='bg-primary/10 absolute -top-14 -right-8 size-36 rounded-full blur-3xl' />
      <div className='relative space-y-1 px-5 py-4'>
        {eyebrow ? (
          <p className='text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase'>
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <p className='text-sm font-medium tracking-tight'>{title}</p>
        ) : null}
        {description ? (
          <p className='text-muted-foreground text-xs'>{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function withGridSpan(field, columns) {
  if (columns !== 2 || field.wrapperClassName) return field;
  if (field.type === 'textarea' || field.type === 'checkbox') {
    return { ...field, wrapperClassName: 'sm:col-span-2' };
  }
  return field;
}

export function FormSection({ section, control, errors, children }) {
  const Icon = SECTION_ICONS[section.icon] ?? Icons.settings;
  const fields = (section.fields ?? [])
    .map((field) => withGridSpan(field, section.columns))
    .map(styleField);

  return (
    <section className='bg-card/40 overflow-hidden rounded-2xl border'>
      <div className='bg-muted/25 border-b px-4 py-3'>
        <div className='flex items-start gap-3'>
          <div className='bg-secondary text-secondary-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border'>
            <Icon className='text-secondary-foreground size-3.5' />
          </div>
          <div className='min-w-0'>
            <h3 className='text-sm font-semibold tracking-tight'>{section.title}</h3>
            {section.description ? (
              <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
                {section.description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {children ? (
        children
      ) : (
        <div className='p-4'>
          <FormBuilder
            control={control}
            errors={errors}
            fields={fields}
            className={cn(
              section.columns === 2 && 'grid gap-4 space-y-0 sm:grid-cols-2'
            )}
          />
        </div>
      )}
    </section>
  );
}

export function SectionedForm({
  formId,
  onSubmit,
  intro,
  sections = [],
  control,
  errors,
  extra,
  extraPosition = 'end'
}) {
  return (
    <form
      id={formId}
      className='animate-in fade-in-0 slide-in-from-bottom-1 space-y-5 duration-300'
      onSubmit={onSubmit}
    >
      {intro ? <FormIntro {...intro} /> : null}
      {extraPosition === 'start' ? extra : null}
      {sections.map((section) => (
        <FormSection
          key={section.id}
          section={section}
          control={control}
          errors={errors}
        />
      ))}
      {extraPosition !== 'start' ? extra : null}
    </form>
  );
}
