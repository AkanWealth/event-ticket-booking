import { Request } from 'express';
import { ModelCtor } from 'sequelize';

// User interface representing the structure of a user object
interface User {
  id?: string; // UUID or string for user ID, optional
  name: string; // Required user name
  email: string; // Required user email
  phone: string; // Required phone number
  password: string; // Required password
  createdAt?: Date | string; // Optional creation timestamp
  updatedAt?: Date | string; // Optional last update timestamp
  deletedAt?: Date | string | null; // Optional soft deletion timestamp
}

// Event interface representing the structure of an event object
interface Events {
  id?: string; // Event ID, optional
  totalTickets: number; // Total number of tickets
  availableTickets: number; // Number of available tickets
  createdAt?: Date | string; // Optional creation timestamp
  updatedAt?: Date | string; // Optional last update timestamp
  deletedAt?: Date | string | null; // Optional soft deletion timestamp
}

// Booking interface representing the structure of a booking object
interface Bookings {
  id?: string; // Booking ID, optional
  userId: string; // ID of the user who made the booking
  eventId: string; // ID of the event being booked
  status: string; // Booking status (e.g., 'confirmed', 'pending')
  createdAt?: Date | string; // Optional creation timestamp
  updatedAt?: Date | string; // Optional last update timestamp
  deletedAt?: Date | string | null; // Optional soft deletion timestamp
}

// Represents a collection of Sequelize models
type Models = {
  [key: string]: ModelCtor<any>;
};

// Function signature for creating custom errors
type CreateErr = (message: string, code?: number, validations?: Record<string, unknown>) => Error;

// Extending Express Request with user info and additional properties
interface AuthenticatedRequest extends Request {
  user: User; // Authenticated user information
  destination?: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // HTTP method
    url: string; // Request URL
  };
}

// Custom error type for the application
interface AppError extends Error {
  code: number; // Custom error code
  name?: string; // Optional error name
  message: string; // Error message
  validations?: Record<string, unknown> | null; // Optional validation error details
}

// Temporary placeholder for unspecified types
type Fix = unknown; // Replace 'any' with 'unknown' for safer typing
