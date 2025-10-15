import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Property Agent Management API',
      version: '1.0.0',
      description: 'API for managing property agents',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        PropertyAgent: {
          type: 'object',
          required: ['id', 'firstName', 'lastName', 'email', 'mobileNumber', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the agent',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            firstName: {
              type: 'string',
              description: 'First name of the agent',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'Last name of the agent',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the agent',
              example: 'john.doe@example.com',
            },
            mobileNumber: {
              type: 'string',
              description: 'Mobile phone number of the agent',
              example: '+1234567890',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the agent was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when the agent was last updated',
            },
          },
        },
        CreatePropertyAgentRequest: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'mobileNumber'],
          properties: {
            firstName: {
              type: 'string',
              description: 'First name of the agent',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'Last name of the agent',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the agent',
              example: 'john.doe@example.com',
            },
            mobileNumber: {
              type: 'string',
              description: 'Mobile phone number of the agent',
              example: '+1234567890',
            },
          },
        },
        UpdatePropertyAgentRequest: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              description: 'First name of the agent',
              example: 'John',
            },
            lastName: {
              type: 'string',
              description: 'Last name of the agent',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the agent',
              example: 'john.doe@example.com',
            },
            mobileNumber: {
              type: 'string',
              description: 'Mobile phone number of the agent',
              example: '+1234567890',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        SuccessMessage: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Success message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);

