import { UserEntity } from '@lib/entities'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseLogger } from './database.logger'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        logger: configService.get('POSTGRES_LOGGING') === 'true' ? new DatabaseLogger() : undefined,
        port: Number(configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [UserEntity],
        autoLoadEntities: true,
        keepConnectionAlive: configService.get('POSTGRES_KEEP_CONNECTION_ALIVE') === 'true',
        logging: configService.get('POSTGRES_LOGGING') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
