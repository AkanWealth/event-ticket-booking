import { config } from 'dotenv';

config();

const { PORT, BACKEND_URL } = process.env;

const doc = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Event booking',
    description: 'An Application to booking events and manage ticketing',
  },
  host: BACKEND_URL || `localhost:${PORT}`,
  basePath: '/',
  tags: [
    {
      name: 'Event',
      description: 'APIs related to events',
    },
    {
      name: 'Booking',
      description: 'APIs related to ticket bookings',
    },
  ],
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {
    '/event/initialize': {
      post: {
        tags: ['Event'],
        summary: 'Initialize a new event',
        description: 'Initialize an event with total available tickets',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'event',
            description: 'Event object containing eventId and totalTickets',
            required: true,
            schema: {
              type: 'object',
              properties: {
                eventId: {
                  type: 'string',
                  description: 'ID of the event',
                },
                totalTickets: {
                  type: 'integer',
                  description: 'Total number of tickets',
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Event initialized successfully',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
                event: {
                  $ref: '#/definitions/Event',
                },
              },
            },
          },
          400: {
            description: 'Invalid input',
          },
        },
      },
    },
    '/event/book': {
      post: {
        tags: ['Booking'],
        summary: 'Book a ticket for an event',
        description: 'Book a ticket if available or add the user to the waiting list if no tickets are available.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'booking',
            description: 'Booking object containing eventId and userId',
            required: true,
            schema: {
              type: 'object',
              properties: {
                eventId: {
                  type: 'string',
                  description: 'ID of the event',
                },
                userId: {
                  type: 'string',
                  description: 'ID of the user booking the ticket',
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Ticket booked or added to waiting list',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
          404: {
            description: 'Event not found',
          },
        },
      },
    },
    '/event/cancel': {
      post: {
        tags: ['Booking'],
        summary: 'Cancel a booking',
        description: 'Cancel an existing ticket booking and free up a slot, or assign it to the next user in the waiting list.',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'cancel',
            description: 'Cancel object containing bookingId',
            required: true,
            schema: {
              type: 'object',
              properties: {
                bookingId: {
                  type: 'string',
                  description: 'ID of the booking to be canceled',
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Booking canceled successfully',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
          404: {
            description: 'Booking not found',
          },
        },
      },
    },
  },
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      in: 'header',
      description: `Add token for authorization using the format Bearer (token) e.g. 'Bearer eetelteouou1223424nkdnkdgndkg'`,
      name: 'Authorization',
    },
  },
  definitions: {
    Event: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'ID of the event',
        },
        totalTickets: {
          type: 'integer',
          description: 'Total number of tickets for the event',
        },
        availableTickets: {
          type: 'integer',
          description: 'Number of available tickets',
        },
      },
    },
    Booking: {
      type: 'object',
      properties: {
        eventId: {
          type: 'string',
          description: 'ID of the event for which the ticket is booked',
        },
        userId: {
          type: 'string',
          description: 'ID of the user who booked the ticket',
        },
        status: {
          type: 'string',
          description: 'Booking status (e.g., CONFIRMED or CANCELED)',
        },
      },
    },
  },
};

export default doc;
