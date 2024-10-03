import { Model, DataTypes, Optional, Sequelize } from 'sequelize';
import { Booking } from '../../types'; // Assuming this is your Booking type

// Define attributes for creation (ID is optional when creating new records)
interface BookingCreationAttributes extends Optional<Booking, 'id'> { }

// Define BookingInstance type (this is the shape of a booking model instance)
interface BookingInstance extends Model<Booking, BookingCreationAttributes>, Booking { }

export default function BookingModel(sequelize: Sequelize) {
  const BookingModel = sequelize.define<BookingInstance>(
    'Booking',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'User', // Correct reference to the 'User' model
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      eventId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Event', // Correct reference to the 'Event' model
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
      timestamps: true, // Automatically add createdAt and updatedAt fields
      tableName: 'Bookings', // Explicit table name
      paranoid: true, // Enable soft delete (adds deletedAt field)
    }
  );

  // @ts-ignore
  BookingModel.associate = function (models: any) {
    // Booking belongs to an Event
    BookingModel.belongsTo(models.Event, {
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Booking belongs to a User
    BookingModel.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };

  return BookingModel;
}