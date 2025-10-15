import express from 'express';
import { createAgent, getAllAgents, getAgent, updateAgent, deleteAgent } from '../store.js';
import { CreatePropertyAgentRequest, UpdatePropertyAgentRequest } from '../types/propertyAgent.js';

const router = express.Router();

// POST /api/agents
router.post('/', (req, res) => {
  try {
    const agent = createAgent(req.body as CreatePropertyAgentRequest);
    res.status(201).json(agent);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// GET /api/agents
router.get('/', (req, res) => {
  const agents = getAllAgents();
  res.json(agents);
});

// GET /api/agents/:id
router.get('/:id', (req, res) => {
  const agent = getAgent(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// PUT /api/agents/:id
router.put('/:id', (req, res) => {
  const agent = updateAgent(req.params.id, req.body as UpdatePropertyAgentRequest);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

// DELETE /api/agents/:id
router.delete('/:id', (req, res) => {
  const deleted = deleteAgent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.status(204).send();
});

export default router;
