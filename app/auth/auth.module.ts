import { DatabaseModule } from '@lib/database'
import { ApplicationEntity, UserEntity } from '@lib/entities'
import { JWTModule, JwtStrategy } from '@lib/jwt'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    JWTModule,
    TypeOrmModule.forFeature([UserEntity, ApplicationEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
