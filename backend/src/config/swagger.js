import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CAMMS API',
      version: '1.0.0',
      description: 'Course Activity Management and Monitoring System API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@camms.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
      // Add production server if API_URL is set
      ...(process.env.API_URL && process.env.API_URL !== 'http://localhost:5000/api'
        ? [
            {
              url: process.env.API_URL,
              description: 'Production server',
            },
          ]
        : []),
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'INSTRUCTOR'],
              description: 'User role',
            },
            phone: {
              type: 'string',
              description: 'User phone number',
            },
            profile_image: {
              type: 'string',
              description: 'Profile image URL',
            },
            is_active: {
              type: 'boolean',
              description: 'User active status',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date',
            },
          },
        },
        Activity: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Activity unique identifier',
            },
            activityType: {
              type: 'string',
              enum: [
                'MDB_REPLY',
                'TICKET_RESPONSE',
                'ASSIGNMENT_UPLOAD',
                'ASSIGNMENT_MARKING',
                'GDB_MARKING',
                'WEEKLY_SESSION',
                'EMAIL_RESPONSE',
              ],
              description: 'Type of activity',
            },
            title: {
              type: 'string',
              description: 'Activity title',
            },
            description: {
              type: 'string',
              description: 'Activity description',
            },
            courseCode: {
              type: 'string',
              description: 'Course code',
            },
            timeSpentMinutes: {
              type: 'integer',
              description: 'Time spent in minutes',
            },
            activityDate: {
              type: 'string',
              format: 'date',
              description: 'Activity date',
            },
            status: {
              type: 'string',
              enum: ['COMPLETED', 'PENDING'],
              description: 'Activity status',
            },
            meta: {
              type: 'object',
              description: 'Additional metadata',
            },
          },
        },
        Report: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Report unique identifier',
            },
            reportType: {
              type: 'string',
              enum: ['WEEKLY', 'MONTHLY', 'FIVE_MONTH'],
              description: 'Report type',
            },
            startDate: {
              type: 'string',
              format: 'date',
              description: 'Report start date',
            },
            endDate: {
              type: 'string',
              format: 'date',
              description: 'Report end date',
            },
            instructorId: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Instructor ID (null for all instructors)',
            },
            filePath: {
              type: 'string',
              nullable: true,
              description: 'Generated report file path',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Report creation date',
            },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Notification unique identifier',
            },
            title: {
              type: 'string',
              description: 'Notification title',
            },
            message: {
              type: 'string',
              description: 'Notification message',
            },
            type: {
              type: 'string',
              enum: ['DEADLINE', 'REMINDER', 'INFO'],
              description: 'Notification type',
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH'],
              description: 'Notification priority',
            },
            isRead: {
              type: 'boolean',
              description: 'Read status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Notification creation date',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              description: 'Success message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Authentication required or token is invalid/expired',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Unauthorized' },
                },
              },
            },
          },
        },
        Forbidden: {
          description: 'Access denied: Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Forbidden: Admin access required' },
                },
              },
            },
          },
        },
        BadRequest: {
          description: 'Invalid request payload or parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Resource not found' },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Server-side error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    join(__dirname, '../routes/*.js'),
    join(__dirname, '../controllers/*.js'),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

