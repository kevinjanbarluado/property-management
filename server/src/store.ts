import { PropertyAgent, CreatePropertyAgentRequest, UpdatePropertyAgentRequest } from './types/propertyAgent.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage
let agents: PropertyAgent[] = [];

// Generate UUID
const generateId = (): string => {
  return uuidv4();
};

// Check if email already exists
const isEmailExists = (email: string, excludeId?: string): boolean => {
  return agents.some(agent => agent.email === email && agent.id !== excludeId);
};

// CRUD operations
export const createAgent = (data: CreatePropertyAgentRequest): PropertyAgent => {
  if (isEmailExists(data.email)) {
    throw new Error('Email already exists');
  }
  
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
  
  // Check if email is being updated and if it already exists
  if (data.email && isEmailExists(data.email, id)) {
    throw new Error('Email already exists');
  }
  
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
