export const STAGE_META = {
  backlog: {
    title: 'Backlog',
    short: 'Backlog',
    index: '01',
    tone: 'quiet'
  },
  inProgress: {
    title: 'In Progress',
    short: 'Active',
    index: '02',
    tone: 'signal'
  },
  review: {
    title: 'Review',
    short: 'Review',
    index: '03',
    tone: 'focus'
  },
  done: {
    title: 'Done',
    short: 'Done',
    index: '04',
    tone: 'settled'
  },
  TODO: {
    title: 'To do',
    short: 'Ready',
    index: '01',
    tone: 'quiet'
  },
  IN_PROGRESS: {
    title: 'In progress',
    short: 'Active',
    index: '02',
    tone: 'signal'
  },
  IN_REVIEW: {
    title: 'In review',
    short: 'Review',
    index: '03',
    tone: 'focus'
  },
  BLOCKED: {
    title: 'Blocked',
    short: 'Blocked',
    index: '04',
    tone: 'alert'
  },
  DONE: {
    title: 'Done',
    short: 'Done',
    index: '05',
    tone: 'settled'
  },
  CANCELLED: {
    title: 'Cancelled',
    short: 'Drop',
    index: '06',
    tone: 'quiet'
  }
};

export function getStageMeta(value) {
  return (
    STAGE_META[value] ?? {
      title: value,
      short: value,
      index: '—',
      tone: 'quiet'
    }
  );
}
