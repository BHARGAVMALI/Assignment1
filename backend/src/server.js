import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import employeesRouter from './routes/employees.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/employees', employeesRouter);

// Centralised error handler
app.use((err, _req, res, _next) => {
    if (err.code === '23505') {
        return res.status(409).json({ message: 'An employee with this email already exists' });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));