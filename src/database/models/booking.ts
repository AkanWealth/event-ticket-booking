import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { Models, Bookings } from '../../types';

// Define attributes for creation (ID is optional when creating new records)
interface BookingCreationAttributes extends Optional<Bookings, 'id'> {}

interface BookingModelType extends Model<Bookings, BookingCreationAttributes> {
  associate: (models: Models) => void;
}

export default function BookingModel(sequelize: Sequelize) {
  const Booking = sequelize.define<BookingModelType>(
    'Booking',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Event', // This refers to the Event table
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        field: 'event_id',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        type: DataTypes.ENUM('CONFIRMED', 'CANCELED', 'WAITLISTED'),
        allowNull: false,
      },
    },
    {
      timestamps: true, // Automatically adds createdAt and updatedAt fields
      tableName: 'Bookings', // Explicit table name
      paranoid: true, // Enable soft delete (adds deletedAt field)
    }
  );

  // @ts-ignore
  Booking.associate = function (models: Models) {
    // Booking belongs to an Event
    Booking.belongsTo(models.event);

    // Booking belongs to a User
    Booking.belongsTo(models.user)
  };

  return Booking;
}