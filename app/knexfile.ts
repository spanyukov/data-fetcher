import * as dotenv from 'dotenv';
dotenv.config();

const KNEX_SCHEMA = process.env.KNEX_SCHEMA || 'public';
const KNEX_CONNECTION = process.env.KNEX_CONNECTION;

module.exports = {
  client: 'pg',
  connection: KNEX_CONNECTION,
  searchPath: [KNEX_SCHEMA],
  migrations: {
    extension: 'ts',
    tableName: 'knex_migrations',
    schemaName: KNEX_SCHEMA,
    directory: './src/db/migrations',
  },
  seeds: {
    schemaName: KNEX_SCHEMA,
    directory: './src/db/seeds'
  }
};
