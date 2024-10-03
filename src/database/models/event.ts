import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Models, Events } from '../../types';

interface EventCreationAttributes extends Optional<Events, 'id'> { }
interface EventModelType extends Model<Events, EventCreationAttributes> {
  associate: (models: Models) => void;
}

export default function EventModel(sequelize: Sequelize) {
  const Event = sequelize.define<EventModelType>(
    'Event',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      totalTickets: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      availableTickets: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true, // Allowing null for soft delete
      },
    },
    {
      tableName: 'Event',
      paranoid: true, // Enable soft delete
      timestamps: true, // Enable createdAt and updatedAt
    }
  );

  // @ts-ignore
  Event.associate = function (models: Models) {
    // models.user.hasMany(models.accounts);
    models.event.hasMany(models.booking)
  };

  return Event;
}