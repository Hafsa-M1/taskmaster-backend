import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: { title: string; description?: string }, user: any): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user: { id: user.id },
      completed: false,
      timeSpent: 0,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    // Ensure all timeSpent values are numbers
    return tasks.map(task => ({
      ...task,
      timeSpent: Number(task.timeSpent) || 0,
    }));
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } },
    });
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Ensure timeSpent is a number
    task.timeSpent = Number(task.timeSpent) || 0;
    
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
    
    // Validate seconds parameter
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds <= 0) {
      throw new BadRequestException('Invalid time value. Must be a positive number.');
    }
    
    // Convert to number to ensure proper addition
    const currentTimeSpent = Number(task.timeSpent) || 0;
    const secondsToAdd = Number(seconds);
    
    task.timeSpent = currentTimeSpent + secondsToAdd;
    
    const updatedTask = await this.tasksRepository.save(task);
    
    // Ensure the returned value has timeSpent as number
    updatedTask.timeSpent = Number(updatedTask.timeSpent) || 0;
    
    return updatedTask;
  }
}