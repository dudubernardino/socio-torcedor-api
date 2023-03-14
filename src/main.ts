import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Users API')
    .setDescription('users api')
    .setVersion('1.0')
    .addTag('users')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3000)

  logger.log(`Application is running ${process.env.NODE_ENV} mode on: ${await app.getUrl()}`)
}
bootstrap()
