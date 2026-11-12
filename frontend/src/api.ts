import axios from 'axios';
import type { Employee, EmployeeInput, EmployeePage } from './types';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
});

export const getErrorMessage = (err: unknown): string =>
    axios.isAxiosError(err)
    ? err.response?.data?.message ?? 'Unable to reach the server'
    : 'Something went wrong';

export const fetchEmployees = (params: { search: string; page: number; limit: number }) =>
    http.get<EmployeePage>('/employees', { params }).then((r) => r.data);

export const createEmployee = (input: EmployeeInput) =>
    http.post<Employee>('/employees', input).then((r) => r.data);

export const updateEmployee = (id: number, input: EmployeeInput) =>
    http.put<Employee>(`/employees/${id}`, input).then((r) => r.data);

export const deleteEmployee = (id: number) => http.delete(`/employees/${id}`);