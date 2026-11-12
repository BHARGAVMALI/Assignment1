import type { Employee } from '../types';

interface Props {
  employees: Employee[];
  loading: boolean;
  editingId?: number;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function EmployeeTable({ employees, loading, editingId, onEdit, onDelete }: Props) {
  if (loading && !employees.length) return <p className="empty">Loading...</p>;
  if (!employees.length) return <p className="empty">No employees found.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th />
          </tr>
        </thead>
        <tbody className={loading ? 'dim' : ''}>
          {employees.map((emp) => (
            <tr key={emp.id} className={emp.id === editingId ? 'active' : ''}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>{formatDate(emp.created_at)}</td>
              <td className="actions">
                <button className="small" onClick={() => onEdit(emp)}>Edit</button>
                <button className="small danger" onClick={() => onDelete(emp)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}