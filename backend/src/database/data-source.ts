import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

const databaseType =
  (process.env.DATABASE_TYPE as DataSourceOptions['type']) ?? 'mysql';

const resolvePort = () => {
  if (process.env.DATABASE_PORT) {
    return parseInt(process.env.DATABASE_PORT, 10);
  }

  return 3306;
};

const resolveMaxConnections = () =>
  process.env.DATABASE_MAX_CONNECTIONS
    ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
    : 25;

const resolveSslOptions = () =>
  process.env.DATABASE_SSL_ENABLED === 'true'
    ? {
        rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
        ca: process.env.DATABASE_CA ?? undefined,
        key: process.env.DATABASE_KEY ?? undefined,
        cert: process.env.DATABASE_CERT ?? undefined,
      }
    : undefined;

const extra: Record<string, unknown> = {};
const sslOptions = resolveSslOptions();

if (databaseType === 'mysql') {
  extra.connectionLimit = resolveMaxConnections();
} else {
  extra.max = resolveMaxConnections();
}

if (sslOptions) {
  extra.ssl = sslOptions;
}

export const AppDataSource = new DataSource({
  type: databaseType,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: resolvePort(),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    entitiesDir: 'src',

    subscribersDir: 'subscriber',
  },
  extra,
} as DataSourceOptions);
