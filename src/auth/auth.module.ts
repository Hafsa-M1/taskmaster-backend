// src/auth/auth.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // ← important

@Module({
  imports: [
    forwardRef(() => UsersModule), // use forwardRef if circular dep error
    JwtModule.register({ /* config later */ }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService], // important for using in other modules
})
export class AuthModule {}