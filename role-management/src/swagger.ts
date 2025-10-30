import express, { Router, Request, Response } from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from "swagger-jsdoc";
import { Express } from 'express';
const router = Router();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      description: 'Complete API documentation for User Management System with Authentication, Admin, and Moderator features',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'User ID' },
            name: { type: 'string', description: 'User full name' },
            email: { type: 'string', format: 'email' },
            role: { $ref: '#/components/schemas/Role' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Role: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', enum: ['Admin', 'Moderator', 'User'] },
            permissions: { type: 'array', items: { type: 'string' } }
          }
        },
        ModeratorRequest: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { $ref: '#/components/schemas/User' },
            reason: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            appliedAt: { type: 'string', format: 'date-time' },
            reviewedAt: { type: 'string', format: 'date-time' },
            reviewedBy: { $ref: '#/components/schemas/User' },
            reviewComments: { type: 'string' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            error: { type: 'string' },
            success: { type: 'boolean' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            success: { type: 'boolean' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'] 
};

const specs = swaggerJsdoc(options);


router.get("/json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
})

router.use("/",swaggerUi.serve, swaggerUi.setup(specs))

export default router