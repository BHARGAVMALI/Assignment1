# Employee Directory

A simple full-stack app to add, view, edit and delete employees.

- **Frontend:** React + TypeScript (Vite), Axios
- **Backend:** Node.js, Express
- **Database:** PostgreSQL

## Features

- Add, edit and delete employees (name, email, role)
- Table view of all employees
- Search by name (debounced, handled on the server)
- Pagination (5 per page)
- Validation on the server, and a clear error for duplicate emails
- CORS enabled for the frontend

## Project structure

```
Assignment/
├── backend/
│   ├── schema.sql
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── db.js
│       └── routes/employees.js
└── frontend/
    └── src/
        ├── App.tsx
        ├── api.ts
        ├── types.ts
        ├── index.css
        ├── hooks/useDebounce.ts
        └── components/
            ├── EmployeeForm.tsx
            ├── EmployeeTable.tsx
            └── Pagination.tsx
```

## Prerequisites

- Node.js 18 or newer
- PostgreSQL (with pgAdmin or the `psql` command line)

## Setup

### 1. Database

Create a database (for example `employee_directory`), then run the contents of `backend/schema.sql` in it.

With `psql`:

```bash
psql -U postgres -c "CREATE DATABASE employee_directory;"
psql -U postgres -d employee_directory -f backend/schema.sql
```

With pgAdmin: create the database, open the Query Tool on it, paste the contents of `backend/schema.sql` and run it.

Table schema:

| Column     | Type         | Notes                |
|------------|--------------|----------------------|
| id         | SERIAL       | Primary key          |
| name       | VARCHAR(100) | Required             |
| email      | VARCHAR(150) | Required, unique     |
| role       | VARCHAR(100) | Required             |
| created_at | TIMESTAMP    | Defaults to `NOW()`  |

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/employee_directory
CORS_ORIGIN=http://localhost:5173
```

Use your own password and database name. Special characters in the password must be URL-encoded (`@` becomes `%40`).

Start the server:

```bash
npm run dev
```

The API runs at http://localhost:5000.

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

Start the app:

```bash
npm run dev
```

Open http://localhost:5173. Keep the backend running in a separate terminal.

## API

| Method | Endpoint                          | Description                  |
|--------|-----------------------------------|------------------------------|
| GET    | `/employees?search=&page=&limit=` | List employees (paginated)   |
| POST   | `/employees`                      | Add an employee              |
| PUT    | `/employees/:id`                  | Update an employee           |
| DELETE | `/employees/:id`                  | Delete an employee           |
| GET    | `/health`                         | Health check                 |

Request body for POST and PUT:

```json
{ "name": "Jane Doe", "email": "jane@company.com", "role": "Developer" }
```

Example GET response:

```json
{
  "data": [
    { "id": 1, "name": "Jane Doe", "email": "jane@company.com", "role": "Developer", "created_at": "2026-11-12T10:00:00.000Z" }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

Error responses use the shape `{ "message": "..." }` with status 400 (validation), 404 (not found), 409 (duplicate email) or 500 (server error).

## Notes

- `.env` files are not committed. Create them as described above.
- Search is case-insensitive and matches any part of the name.