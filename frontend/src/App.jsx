import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    birthdate: '',
    salary: ''
  });

  const load = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      salary: form.salary === '' ? null : Number(form.salary)
    };

    if (editingId) {
      // UPDATE employee
      await api.put(`/employees/${editingId}`, payload);
    } else {
      // CREATE employee
      await api.post('/employees', payload);
    }

    setForm({
      first_name: '',
      last_name: '',
      email: '',
      birthdate: '',
      salary: ''
    });

    setEditingId(null);
    await load();
  };

  const startEdit = (emp) => {
    setForm({
      first_name: emp.first_name || '',
      last_name: emp.last_name || '',
      email: emp.email || '',
      birthdate: emp.birthdate || '',
      salary: emp.salary || ''
    });

    setEditingId(emp.employee_id);
  };

  const deleteEmployee = async (id) => {
    await api.delete(`/employees/${id}`);
    await load();
  };

  return (
    <div style={{ margin: 20 }}>
      <h1>Employees</h1>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Email</th>
            <th>Birthdate</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.employee_id}>
              <td>{emp.employee_id}</td>
              <td>{emp.first_name || '-'}</td>
              <td>{emp.last_name || '-'}</td>
              <td>{emp.email || '-'}</td>
              <td>{emp.birthdate ? new Date(emp.birthdate).toLocaleDateString() : '-'}</td>
              <td>{emp.salary != null ? Number(emp.salary).toFixed(2) : '-'}</td>

              <td>
                <button onClick={() => startEdit(emp)}>Edit</button>
                <button onClick={() => deleteEmployee(emp.employee_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <form onSubmit={onSubmit} style={{ marginBottom: 20 }}>
        <input
          name="first_name"
          value={form.first_name}
          onChange={onChange}
          placeholder="First name"
        />

        <input
          name="last_name"
          value={form.last_name}
          onChange={onChange}
          placeholder="Last name"
        />

        <input
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
        />

        <input
          name="birthdate"
          type="date"
          value={form.birthdate}
          onChange={onChange}
        />

        <input
          name="salary"
          type="number"
          step="0.01"
          value={form.salary}
          onChange={onChange}
          placeholder="Salary"
        />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </form>
    </div>
  );
}