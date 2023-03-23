import { DatabaseModule } from '@lib/database'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailsService } from './emails.service'

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, TypeOrmModule.forFeature([])],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
