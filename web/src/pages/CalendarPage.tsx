import { FormEvent, useEffect, useState } from 'react';
import { api, Activity, Organization, Session } from '../lib/api';

export function CalendarPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [form, setForm] = useState({
    activity_id: '',
    start_at: '',
    end_at: '',
    capacity: '10',
    credits_required: '2',
    instructor_name: '',
  });
  const [message, setMessage] = useState('');

  const load = async () => {
    const [orgRes, actRes, sessRes] = await Promise.all([
      api.staffOrganization(),
      api.staffActivities(),
      api.sessions(),
    ]);
    setOrg(orgRes);
    setActivities(actRes.activities);
    setSessions(sessRes.sessions);
    if (actRes.activities.length && !form.activity_id) {
      setForm((f) => ({ ...f, activity_id: String(actRes.activities[0].id) }));
    }
  };

  useEffect(() => {
    load().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.staffCreateSession({
        activity_id: Number(form.activity_id),
        start_at: new Date(form.start_at).toISOString(),
        end_at: new Date(form.end_at).toISOString(),
        capacity: Number(form.capacity),
        credits_required: Number(form.credits_required),
        instructor_name: form.instructor_name,
      });
      setMessage('Sessione creata');
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Errore');
    }
  };

  return (
    <div>
      <h1 className="page-title">Calendario · {org?.name ?? '...'}</h1>
      <div className="card">
        <h2>Nuova sessione</h2>
        {message && <p>{message}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Attività
            <select value={form.activity_id} onChange={(e) => setForm({ ...form, activity_id: e.target.value })} required>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Inizio
            <input type="datetime-local" value={form.start_at} onChange={(e) => setForm({ ...form, start_at: e.target.value })} required />
          </label>
          <label>
            Fine
            <input type="datetime-local" value={form.end_at} onChange={(e) => setForm({ ...form, end_at: e.target.value })} required />
          </label>
          <label>
            Capienza
            <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
          </label>
          <label>
            Crediti richiesti
            <input type="number" value={form.credits_required} onChange={(e) => setForm({ ...form, credits_required: e.target.value })} />
          </label>
          <label>
            Istruttore
            <input value={form.instructor_name} onChange={(e) => setForm({ ...form, instructor_name: e.target.value })} />
          </label>
          <button type="submit" className="btn-primary">
            Crea sessione
          </button>
        </form>
      </div>
      <div className="card">
        <h2>Sessioni programmate</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Attività</th>
              <th>Quando</th>
              <th>Istruttore</th>
              <th>Crediti</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>{s.activity?.name ?? s.activity_id}</td>
                <td>{new Date(s.start_at).toLocaleString('it-IT')}</td>
                <td>{s.instructor_name}</td>
                <td>{s.credits_required}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
