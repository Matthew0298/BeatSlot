import { Session } from '@/lib/api';

export function formatSessionTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function sessionDurationMinutes(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const minutes = Math.max(30, Math.round(ms / 60000));
  return `${minutes} min`;
}

export function sessionToCardProps(session: Session) {
  return {
    title: session.activity?.name ?? 'Lezione',
    instructor: session.instructor_name ?? 'Staff',
    time: formatSessionTime(session.start_at),
    duration: sessionDurationMinutes(session.start_at, session.end_at),
    capacity: session.capacity,
    enrolled: session.booked_count ?? 0,
    credits: session.credits_required,
  };
}
