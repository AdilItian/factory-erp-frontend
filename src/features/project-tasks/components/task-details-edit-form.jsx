'use client';

import FormBuilder from '@/components/ui/form-builder';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { getTaskEditFormSections } from '../constants/task-form-config';
import { getTaskIssueKey, getTaskTitle } from '../utils/normalize-task';

const SECTION_ICONS = {
  post: Icons.post,
  kanban: Icons.kanban,
  user: Icons.user
};

function FormSection({ section, control, errors }) {
  const Icon = SECTION_ICONS[section.icon] ?? Icons.settings;

  return (
    <section className='bg-card/40 overflow-hidden rounded-2xl border'>
      <div className='bg-muted/25 border-b px-4 py-3'>
        <div className='flex items-start gap-3'>
          <div className='bg-background text-muted-foreground mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border'>
            <Icon className='size-3.5' />
          </div>
          <div className='min-w-0'>
            <h3 className='text-sm font-semibold tracking-tight'>{section.title}</h3>
            <p className='text-muted-foreground mt-0.5 text-xs leading-relaxed'>
              {section.description}
            </p>
          </div>
        </div>
      </div>
      <div className='p-4'>
        <FormBuilder
          control={control}
          errors={errors}
          fields={section.fields}
          className={cn(
            section.columns === 2 && 'grid gap-4 space-y-0 sm:grid-cols-2'
          )}
        />
      </div>
    </section>
  );
}

export function TaskDetailsEditForm({
  task,
  mode = 'edit',
  formId = 'task-details-edit-form',
  control,
  errors,
  assigneeOptions,
  isUsersLoading,
  onSubmit
}) {
  const isCreate = mode === 'create';
  const sections = getTaskEditFormSections(assigneeOptions);
  const issueKey = task ? getTaskIssueKey(task) : '';

  return (
    <form
      id={formId}
      className='animate-in fade-in-0 slide-in-from-bottom-1 space-y-5 duration-300'
      onSubmit={onSubmit}
    >
      <div className='relative overflow-hidden rounded-2xl border'>
        <div className='from-primary/10 via-background to-background absolute inset-0 bg-gradient-to-br' />
        <div className='bg-primary/10 absolute -top-14 -right-8 size-36 rounded-full blur-3xl' />
        <div className='relative space-y-1 px-5 py-4'>
          <p className='text-muted-foreground text-[11px] font-medium tracking-[0.14em] uppercase'>
            {isCreate ? 'New task' : 'Editing'}
          </p>
          <p className='text-sm font-medium tracking-tight'>
            {isCreate
              ? 'Start with a clear title, then shape workflow and ownership.'
              : `${issueKey ? `${issueKey} · ` : ''}${getTaskTitle(task)}`}
          </p>
          <p className='text-muted-foreground text-xs'>
            {isCreate
              ? 'Sections below mirror the edit experience — fill what you know now.'
              : 'Soft changes only — save when the details feel right.'}
          </p>
        </div>
      </div>

      {isUsersLoading ? (
        <div className='bg-muted/30 rounded-2xl border px-4 py-8 text-center'>
          <Icons.spinner className='text-muted-foreground mx-auto size-5 animate-spin' />
          <p className='text-muted-foreground mt-3 text-sm'>Loading assignees...</p>
        </div>
      ) : (
        sections.map((section) => (
          <FormSection
            key={section.id}
            section={section}
            control={control}
            errors={errors}
          />
        ))
      )}
    </form>
  );
}
