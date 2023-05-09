import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error'],
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('YAssignment')
    .setDescription("YAssignment's API")
    .setVersion('0.1.0')
    .addServer('http://localhost:3000', 'Local Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

patchNestJsSwagger();
bootstrap();
