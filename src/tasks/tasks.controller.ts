import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import type { Request } from 'express'; // ← Use import type
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: AuthenticatedRequest) {
    return this.tasksService.create(createTaskDto, req.user);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.tasksService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    return this.tasksService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    return this.tasksService.remove(id, req.user.id);
  }

  @Post(':id/timer')
  async updateTimer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { seconds: number },
    @Req() req: AuthenticatedRequest,
  ) {
    return this.tasksService.updateTimeSpent(id, body.seconds, req.user.id);
  }
}