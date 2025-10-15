import express from 'express';
import { createAgent, getAllAgents, getAgent, updateAgent, deleteAgent } from '../store.js';
import { CreatePropertyAgentRequest, UpdatePropertyAgentRequest } from '../types/propertyAgent.js';
import { ValidationMiddleware, PropertyAgentValidationRules } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/agents:
 *   post:
 *     summary: Create a new property agent
 *     tags: [Agents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyAgentRequest'
 *     responses:
 *       201:
 *         description: Agent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyAgent'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  ValidationMiddleware.sanitizeInput,
  ValidationMiddleware.validate(PropertyAgentValidationRules.create),
  (req, res) => {
    try {
      const agent = createAgent(req.body as CreatePropertyAgentRequest);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(400).json({ error: 'Invalid data' });
    }
  }
);

/**
 * @swagger
 * /api/agents:
 *   get:
 *     summary: Get all property agents
 *     tags: [Agents]
 *     responses:
 *       200:
 *         description: List of all agents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PropertyAgent'
 */
router.get('/', (req, res) => {
  const agents = getAllAgents();
  res.json(agents);
});

/**
 * @swagger
 * /api/agents/{id}:
 *   get:
 *     summary: Get a specific property agent by ID
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyAgent'
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', (req, res) => {
  const agent = getAgent(req.params.id);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json(agent);
});

/**
 * @swagger
 * /api/agents/{id}:
 *   put:
 *     summary: Update a property agent
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Agent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyAgentRequest'
 *     responses:
 *       200:
 *         description: Agent updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyAgent'
 *       400:
 *         description: Invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id',
  ValidationMiddleware.sanitizeInput,
  ValidationMiddleware.validate(PropertyAgentValidationRules.update),
  (req, res) => {
    try {
      const agent = updateAgent(req.params.id, req.body as UpdatePropertyAgentRequest);
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      res.json(agent);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists') {
        return res.status(409).json({ error: 'Email already exists' });
      }
      res.status(400).json({ error: 'Invalid data' });
    }
  }
);

/**
 * @swagger
 * /api/agents/{id}:
 *   delete:
 *     summary: Delete a property agent
 *     tags: [Agents]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Agent ID
 *     responses:
 *       200:
 *         description: Agent deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMessage'
 *       404:
 *         description: Agent not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', (req, res) => {
  const deleted = deleteAgent(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.status(200).json({ message: 'Agent deleted successfully' });
});

export default router;
