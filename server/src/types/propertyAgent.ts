export interface PropertyAgent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePropertyAgentRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface UpdatePropertyAgentRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
}

export interface PropertyAgentResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}
