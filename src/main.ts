import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

function generateSwagger(app, configService) {
  const config = new DocumentBuilder()
    .setTitle(configService.get('app.appName'))
    .setDescription('Document Management')
    .setVersion('1.0')
    .addTag(configService.get('app.appName'))
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(configService.get('swagger.endpoint'), app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);
  generateSwagger(app, configService);
  await app.listen(3000);
}
bootstrap();
