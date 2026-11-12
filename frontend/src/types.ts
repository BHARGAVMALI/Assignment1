export interface Employee {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export type EmployeeInput = Pick<Employee, 'name' | 'email' | 'role'>;

export interface EmployeePage {
    data: Employee[];
    total: number;
    page: number;
    totalPages: number;
}