import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: { title: string; description?: string }, user: any): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user: { id: user.id }, // Just pass user id, TypeORM will handle the relationship
      completed: false,
      timeSpent: 0,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    
    return task;
  }

  async update(
    id: string,
    updateTaskDto: { title?: string; description?: string; completed?: boolean },
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    
    Object.assign(task, updateTaskDto);
    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
  }

  async updateTimeSpent(id: string, seconds: number, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.timeSpent += seconds;
    return this.tasksRepository.save(task);
  }
}