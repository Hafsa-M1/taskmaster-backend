import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super-secret-key-for-dev-only-change-this',
    });
  }

  async validate(payload: any) {
    // Check if payload has sub (standard JWT field for subject/user id)
    const userId = payload.sub || payload.id;
    
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }
    
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Return user without password
    const { password, ...result } = user;
    return result;
  }
}