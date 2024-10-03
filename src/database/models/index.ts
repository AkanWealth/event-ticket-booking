// import { Sequelize } from 'sequelize';
// import dbconfig from '../config/config'; // Assuming your config is a TypeScript module or JSON
// import UserModel from './userSample'; // Assuming this is a function that returns a model
// import EventModel from './event';
// import BookingModel from './booking';

// // Get the current environment or default to 'development'
// const { NODE_ENV = 'development' } = process.env;

// // Extract the config based on the current environment
// const config = dbconfig[NODE_ENV] || {};

// // Initialize the Sequelize instance
// let sequelize: Sequelize;
// if (config.use_env_variable) {
//   const envVar = process.env[config.use_env_variable];
//   if (!envVar) {
//     throw new Error(`Environment variable ${config.use_env_variable} not set.`);
//   }
//   sequelize = new Sequelize(envVar, config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// // Interface for DB object to ensure typing support
// interface DB {
//   sequelize: Sequelize;
//   Sequelize: typeof Sequelize;
//   user: ReturnType<typeof UserModel>;
//   event: ReturnType<typeof EventModel>;
//   booking: ReturnType<typeof BookingModel>;
//   [key: string]: any; // Allows adding more models dynamically
// }

// // Create the DB object and add models manually for autocompletion
// const db: DB = {
//   sequelize,
//   Sequelize,
//   user: UserModel(sequelize),
//   event: EventModel(sequelize), 
//   booking: BookingModel(sequelize),
// };

// // **Setup associations for models**: Ensure that only models are associated
// Object.values(db).forEach((model) => {
//   if (typeof model?.associate === 'function') {
//     model.associate(db); // Call associate method for each model
//   }
// });

// export default db;


// import { Sequelize } from 'sequelize';
// import dbconfig from '../config/config';
// import UserModel from './userSample';
// import EventModel from './event';
// import BookingModel from './booking';

// // Get the current environment or default to 'development'
// const { NODE_ENV = 'development' } = process.env;

// // Extract the config based on the current environment
// const config = dbconfig[NODE_ENV] || {};

// // Initialize the Sequelize instance
// let sequelize: Sequelize;
// if (config.use_env_variable) {
//   const envVar = process.env[config.use_env_variable];
//   if (!envVar) {
//     throw new Error(`Environment variable ${config.use_env_variable} not set.`);
//   }
//   sequelize = new Sequelize(envVar, config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// // Interface for DB object to ensure typing support
// interface DB {
//   sequelize: Sequelize;
//   Sequelize: typeof Sequelize;
//   User: ReturnType<typeof UserModel>;
//   Event: ReturnType<typeof EventModel>;
//   Booking: ReturnType<typeof BookingModel>;
//   [key: string]: any; // Allows adding more models dynamically
// }

// // Initialize the models
// const db: DB = {
//   sequelize,
//   Sequelize,
//   User: UserModel(sequelize),
//   Event: EventModel(sequelize),
//   Booking: BookingModel(sequelize),
// };

// // **Setup associations for models**: Ensure that only models are associated
// Object.values(db).forEach((model) => {
//   if (typeof model?.associate === 'function') {
//     model.associate(db); // Call associate method for each model
//   }
// });

// export default db;


import { Sequelize } from 'sequelize';

import dbconfig from '../config/config';
import UserModel from './userSample';
import BookingModel from './booking';
import EventModel from './event';

const { NODE_ENV = 'development' } = process.env;

const config = dbconfig[NODE_ENV];

let sequelize: Sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const db = {
  sequelize,
  Sequelize,
  // Add models here e.g cards: cards(sequelize)
  // Doing this manually to enable auto complete when destructuring
  user: UserModel(sequelize),
  booking: BookingModel(sequelize),
  event: EventModel(sequelize),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;