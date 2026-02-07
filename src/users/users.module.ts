import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity'; // adjust path

@Module({
  imports: [TypeOrmModule.forFeature([User])],   // ← this line is crucial!
  providers: [UsersService],
  exports: [UsersService],                        // so AuthService can use it
})
export class UsersModule {}