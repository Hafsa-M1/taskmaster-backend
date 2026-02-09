import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS - this is the critical fix for your frontend-backend connection
  app.enableCors({
    origin: [
      'http://localhost:3000',     // default React port
      'http://localhost:3001',     // sometimes CRA uses next available port
      'http://127.0.0.1:3000',     // sometimes localhost is resolved as 127.0.0.1
      'http://127.0.0.1:3001',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,            // allow cookies / auth headers if you add them later
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Global validation pipe (already good, keeping it)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();