import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'taskmaster-jwt-secret-2024-final-fix-12345',
    });
    
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: any) {
    this.logger.debug(`=== JWT VALIDATION STARTED ===`);
    this.logger.debug(`Payload received: ${JSON.stringify(payload)}`);
    
    const userId = payload.sub;
    
    if (!userId) {
      this.logger.error('No user ID (sub) in token payload');
      throw new UnauthorizedException('Invalid token payload');
    }
    
    this.logger.debug(`Looking for user with ID: ${userId}`);
    
    try {
      // Log before query
      this.logger.debug(`Calling usersService.findById(${userId})`);
      
      const user = await this.usersService.findById(userId);
      
      this.logger.debug(`User found: ${user ? 'Yes' : 'No'}`);
      
      if (!user) {
        this.logger.error(`User not found in database for ID: ${userId}`);
        this.logger.error(`Available users in database:`);
        // You might want to log all users for debugging
        throw new UnauthorizedException('User not found');
      }
      
      this.logger.debug(`User details: ${user.email}`);
      this.logger.debug(`=== JWT VALIDATION SUCCESS ===`);
      
      // Don't return password
      const { password, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`JWT Validation ERROR: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw new UnauthorizedException('User validation failed');
    }
  }
}