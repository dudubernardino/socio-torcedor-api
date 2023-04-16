import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { UsersService } from './users/users.service'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule)

  const usersService = app.get(UsersService)
  // Verify First Super Admin User
  usersService.createFirstUser()

  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('Sócio Torcedor API')
    .setDescription('sócio torcedor api')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)

  logger.log(`Application is running ${process.env.NODE_ENV} mode on: ${await app.getUrl()}`)
}
bootstrap()
