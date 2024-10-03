const {
  DB_HOST,
  DB_NAME,
  DB_PASS,
  DB_USER,
  DB_PORT,
  TEST_DB_NAME,
  DB_MIGRATION_TABLE,
} = process.env;

module.exports = {
  development: {
    host: DB_HOST,
    port: DB_PORT,
    logging: false,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: true,
      },
    },
    use_env_variable: false,
    ...(DB_MIGRATION_TABLE ? { migrationStorageTableName: DB_MIGRATION_TABLE } : {}),
  },
  test: {
    host: DB_HOST,
    port: DB_PORT,
    logging: false,
    username: DB_USER,
    password: DB_PASS,
    database: TEST_DB_NAME,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: true,
      },
    },
    use_env_variable: false,
    ...(DB_MIGRATION_TABLE ? { migrationStorageTableName: DB_MIGRATION_TABLE } : {}),
  },
  staging: {
    host: DB_HOST,
    port: DB_PORT,
    logging: false,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: true,
      },
    },
    pool: {
      min: 0,
      max: 100,
      acquire: 1000000,
    },
    use_env_variable: false,
    ...(DB_MIGRATION_TABLE ? { migrationStorageTableName: DB_MIGRATION_TABLE } : {}),
  },
  production: {
    host: DB_HOST,
    port: DB_PORT,
    logging: false,
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: true,
      },
    },
    pool: {
      min: 0,
      max: 100,
      acquire: 1000000,
    },
    use_env_variable: false,
    ...(DB_MIGRATION_TABLE ? { migrationStorageTableName: DB_MIGRATION_TABLE } : {}),
  },
};
