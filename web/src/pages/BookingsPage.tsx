import { useEffect, useState } from 'react';
import { api, Booking } from '../lib/api';

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    api
      .staffBookings(status || undefined)
      .then((res) => setBookings(res.bookings))
      .catch(() => setBookings([]));
  }, [status]);

  return (
    <div>
      <h1 className="page-title">Prenotazioni</h1>
      <div className="card">
        <label>
          Filtra stato{' '}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tutte</option>
            <option value="confirmed">Confermate</option>
            <option value="cancelled">Cancellate</option>
          </select>
        </label>
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Lezione</th>
              <th>Data</th>
              <th>Stato</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user ? `${b.user.nome} ${b.user.cognome}`.trim() : '—'}</td>
                <td>{b.session?.activity?.name ?? '—'}</td>
                <td>{b.session ? new Date(b.session.start_at).toLocaleString('it-IT') : '—'}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p>Nessuna prenotazione</p>}
      </div>
    </div>
  );
}
