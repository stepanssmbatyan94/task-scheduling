import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const databaseType =
      this.configService.get('database.type', { infer: true }) ?? 'mysql';
    const maxConnections = this.configService.get('database.maxConnections', {
      infer: true,
    });

    const sslEnabled = this.configService.get('database.sslEnabled', {
      infer: true,
    });
    const sslOptions = sslEnabled
      ? {
          rejectUnauthorized: this.configService.get(
            'database.rejectUnauthorized',
            { infer: true },
          ),
          ca:
            this.configService.get('database.ca', {
              infer: true,
            }) ?? undefined,
          key:
            this.configService.get('database.key', {
              infer: true,
            }) ?? undefined,
          cert:
            this.configService.get('database.cert', {
              infer: true,
            }) ?? undefined,
        }
      : undefined;

    const extra: Record<string, unknown> = {};
    if (databaseType === 'mysql') {
      extra.connectionLimit = maxConnections;
    } else {
      extra.max = maxConnections;
    }

    if (sslOptions) {
      extra.ssl = sslOptions;
    }

    return {
      type: databaseType,
      url: this.configService.get('database.url', { infer: true }),
      host: this.configService.get('database.host', { infer: true }),
      port: this.configService.get('database.port', { infer: true }),
      username: this.configService.get('database.username', { infer: true }),
      password: this.configService.get('database.password', { infer: true }),
      database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',

        subscribersDir: 'subscriber',
      },
      extra,
    } as TypeOrmModuleOptions;
  }
}
