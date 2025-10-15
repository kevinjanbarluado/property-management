import { PropertyAgent, CreatePropertyAgentRequest, UpdatePropertyAgentRequest } from './types/propertyAgent.js';

// In-memory storage
let agents: PropertyAgent[] = [];

// Generate UUID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// CRUD operations
export const createAgent = (data: CreatePropertyAgentRequest): PropertyAgent => {
  const now = new Date();
  const agent: PropertyAgent = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now
  };
  agents.push(agent);
  return agent;
};

export const getAllAgents = (): PropertyAgent[] => {
  return agents;
};

export const getAgent = (id: string): PropertyAgent | undefined => {
  return agents.find(agent => agent.id === id);
};

export const updateAgent = (id: string, data: UpdatePropertyAgentRequest): PropertyAgent | null => {
  const index = agents.findIndex(agent => agent.id === id);
  if (index === -1) return null;
  
  agents[index] = {
    ...agents[index],
    ...data,
    updatedAt: new Date()
  };
  return agents[index];
};

export const deleteAgent = (id: string): boolean => {
  const index = agents.findIndex(agent => agent.id === id);
  if (index === -1) return false;
  
  agents.splice(index, 1);
  return true;
};
