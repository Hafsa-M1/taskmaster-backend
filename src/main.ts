import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation for all incoming requests
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,                // strip properties not in DTO
      forbidNonWhitelisted: true,     // throw error if unknown properties are sent
      transform: true,                // automatically transform payload to DTO types
      transformOptions: {
        enableImplicitConversion: true, // optional: convert query params / body values
      },
    }),
  );

  // Optional: enable CORS if you plan to connect React frontend later
  // app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();