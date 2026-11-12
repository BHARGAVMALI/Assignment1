import { Router } from 'express';
import pool from '../db.js';

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ name, email, role } = {}) => {
    const fields = [name, email, role];
    if (!fields.every((v) => typeof v === 'string' && v.trim())) {
    return 'Name, email and role are required';
    }
    if (!EMAIL_RE.test(email.trim())) return 'Invalid email address';
    return null;
};

const clean = ({ name, email, role }) => ({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role.trim(),
});

// GET /employees?search=&page=&limit=
router.get('/', async (req, res, next) => {
    try {
        const search = String(req.query.search ?? '').trim();
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 5, 1), 50);
        const like = `%${search}%`;
        const [rows, count] = await Promise.all([
            pool.query(
                `SELECT * FROM employees WHERE name ILIKE $1
                ORDER BY created_at DESC, id DESC LIMIT $2 OFFSET $3`,
                [like, limit, (page - 1) * limit]
            ),
            pool.query('SELECT COUNT(*)::int AS total FROM employees WHERE name ILIKE $1', [like]),
        ]);
        const total = count.rows[0].total;
        res.json({ data: rows.rows, total, page, totalPages: Math.max(Math.ceil(total / limit), 1) });
    } catch (err) {
        next(err);
    }
});

// POST /employees
router.post('/', async (req, res, next) => {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
        const { name, email, role } = clean(req.body);
        const { rows } = await pool.query(
        'INSERT INTO employees (name, email, role) VALUES ($1, $2, $3) RETURNING *',
        [name, email, role]
    );
    res.status(201).json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// PUT /employees/:id
router.put('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid id' });

    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
    const { name, email, role } = clean(req.body);
    const { rows } = await pool.query(
        'UPDATE employees SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING *',
        [name, email, role, id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Employee not found' });
    res.json(rows[0]);
    } catch (err) {
        next(err);
    }
});

// DELETE /employees/:id
router.delete('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!id) return res.status(400).json({ message: 'Invalid id' });

    try {
        const { rowCount } = await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        if (!rowCount) return res.status(404).json({ message: 'Employee not found' });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;