import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import agentsRouter from './routes/agents.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON spec
app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.get('/', (_req, res) => {
    res.json({
        message: 'API running 🚀',
        status: 'success',
        documentation: `http://localhost:${PORT}/api-docs`,
        openApiSpec: `http://localhost:${PORT}/api-docs.json`
    });
});

app.use('/api/agents', agentsRouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
