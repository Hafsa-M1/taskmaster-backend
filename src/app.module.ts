import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity'; // adjust path if needed
// import other modules like AuthModule, TasksModule when ready

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes env variables accessible throughout the app
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User /* add Task entity later */],
      synchronize: true,           // only for dev, auto-creates tables
      logging: ['query', 'error'], // helpful for debugging
    }),
    // AuthModule,
    // TasksModule,
  ],
  // controllers: [...],
  // providers: [...],
})
export class AppModule {}
