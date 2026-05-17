import { useEffect, useState } from 'react';
import { api, User } from '../lib/api';

export function MembersPage() {
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    api
      .staffMembers()
      .then((res) => setMembers(res.members))
      .catch(() => setMembers([]));
  }, []);

  return (
    <div>
      <h1 className="page-title">Clienti</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.nome} {m.cognome}
                </td>
                <td>{m.email}</td>
                <td>{m.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && <p>Nessun cliente iscritto</p>}
      </div>
    </div>
  );
}
