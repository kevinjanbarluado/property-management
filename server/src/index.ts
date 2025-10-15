import express from 'express';
import cors from 'cors';
import agentsRouter from './routes/agents.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({
        message: 'API running 🚀',
        status: 'success'
    });
});

app.use('/api/agents', agentsRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
