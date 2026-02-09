import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    console.log(`[UsersService] findByEmail called: ${email}`);
    return this.usersRepository.findOne({ 
      where: { email },
      // We need password for login validation
    });
  }

  async findById(id: string): Promise<User | null> {
    console.log(`[UsersService] findById called with ID: ${id}`);
    
    try {
      console.log(`[UsersService] Querying database for user ${id}`);
      
      const user = await this.usersRepository.findOne({ 
        where: { id },
        select: ['id', 'email', 'name', 'createdAt', 'updatedAt']
      });
      
      console.log(`[UsersService] Query result:`, user);
      console.log(`[UsersService] User found: ${user ? user.email : 'NOT FOUND'}`);
      
      return user;
    } catch (error) {
      console.error(`[UsersService] ERROR finding user by ID ${id}:`, error);
      console.error(`[UsersService] Error details:`, error.message);
      return null;
    }
  }

  async create(createUserDto: { email: string; password: string; name?: string }): Promise<User> {
    console.log(`[UsersService] Creating user: ${createUserDto.email}`);
    
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
    });

    const savedUser = await this.usersRepository.save(user);
    console.log(`[UsersService] User created successfully: ${savedUser.email}`);
    return savedUser;
  }
}