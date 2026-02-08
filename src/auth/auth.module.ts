import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity'; // ← adjust path if your User entity is elsewhere (e.g. src/users/entities/user.entity)

@Module({
  imports: [
    forwardRef(() => UsersModule), // prevents circular dependency issues
    TypeOrmModule.forFeature([User]), // allows direct repository injection if needed
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-this', // use .env in production
      signOptions: { expiresIn: '60m' }, // token expires in 60 minutes
    }),
  ],
  controllers: [AuthController],      // ← this is mandatory – tells NestJS this module has this controller
  providers: [AuthService],
  exports: [AuthService],             // allows other modules to use AuthService (e.g. for guards later)
})
export class AuthModule {}