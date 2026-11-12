import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Employee, EmployeeInput } from '../types';
import { getErrorMessage } from '../api';

interface Props {
  editing: Employee | null;
  onSubmit: (input: EmployeeInput) => Promise<void>;
  onCancel: () => void;
}

const EMPTY: EmployeeInput = { name: '', email: '', role: '' };

export default function EmployeeForm({ editing, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<EmployeeInput>(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editing ? { name: editing.name, email: editing.email, role: editing.role } : EMPTY);
    setError('');
  }, [editing]);

  const handleChange = (field: keyof EmployeeInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSubmit(form);
      setForm(EMPTY);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>{editing ? 'Edit employee' : 'Add employee'}</h2>

      <div className="form-row">
        <label>
          Name
          <input value={form.name} onChange={handleChange('name')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={handleChange('email')} required />
        </label>
        <label>
          Role
          <input value={form.role} onChange={handleChange('role')} required />
        </label>

        <div className="form-actions">
          <button className="primary" disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
          </button>
          {editing && (
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && <p className="error">{error}</p>}
    </form>
  );
}