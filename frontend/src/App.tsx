import { useCallback, useEffect, useState } from 'react';
import EmployeeForm from './components/EmployeeForm';
import EmployeeTable from './components/EmployeeTable';
import Pagination from './components/Pagination';
import { useDebounce } from './hooks/useDebounce';
import { createEmployee, deleteEmployee, fetchEmployees, getErrorMessage, updateEmployee } from './api';
import type { Employee, EmployeeInput } from './types';

const PAGE_SIZE = 5;

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(search);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchEmployees({ search: debouncedSearch, page, limit: PAGE_SIZE });
      setEmployees(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
      setError('');
    } catch {
      setError('Could not load employees. Is the API running?');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSubmit = async (input: EmployeeInput) => {
    if (editing) {
      await updateEmployee(editing.id, input);
      setEditing(null);
      await load();
    } else {
      await createEmployee(input);
      if (page === 1) await load();
      else setPage(1);
    }
  };

  const handleDelete = async (employee: Employee) => {
    if (!window.confirm(`Delete ${employee.name}?`)) return;
    try {
      await deleteEmployee(employee.id);
      if (editing?.id === employee.id) setEditing(null);
      if (employees.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="container">
      <h1>Employee Directory</h1>
      <p className="subtitle">{total} {total === 1 ? 'employee' : 'employees'}</p>

      <EmployeeForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

      <section className="card">
        <input
          className="search"
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <EmployeeTable
          employees={employees}
          loading={loading}
          editingId={editing?.id}
          onEdit={setEditing}
          onDelete={handleDelete}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </main>
  );
}