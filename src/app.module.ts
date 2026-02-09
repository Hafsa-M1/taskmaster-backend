import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity'; 
import { Task } from './entities/task.entity'; 



import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

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
      entities: [User, Task],
      synchronize: true,           // only for dev, auto-creates tables
      logging: ['query', 'error'], // helpful for debugging
    }),

    AuthModule,          
    UsersModule, 
    TasksModule,    
          

    // TasksModule,      // ← uncomment/add when you create tasks module
  ],
  // controllers: [AppController], // ← if you have a default controller
  // providers: [AppService],
})
export class AppModule {}