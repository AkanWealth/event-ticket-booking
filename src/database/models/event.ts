import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import { Models, Events } from '../../types';

interface EventCreationAttributes extends Optional<Events, 'id'> {}
interface EventInstance extends Model<Events, EventCreationAttributes>, Events {}

export default function EventModel(sequelize: Sequelize) {
  const Event = sequelize.define<EventInstance>(
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
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'Event',
      paranoid: true,
    }
  );

  // @ts-ignore
  Event.associate = function (models: Models) {
    Event.hasMany(models.Booking, { 
      foreignKey: 'eventId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
     });
  };

  return Event;
}
