import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In,Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { BatchOperationDto,BatchOperationType  } from './dto/batch-tasks.dto';

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TaskStatus } from './enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectQueue('task-processing')
    private taskQueue: Queue,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    // Inefficient implementation: creates the task but doesn't use a single transaction
    // for creating and adding to queue, potential for inconsistent state
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);

    // Add to queue without waiting for confirmation or handling errors
    this.taskQueue.add('task-status-update', {
      taskId: savedTask.id,
      status: savedTask.status,
    });

    return savedTask;
  }

  async findAll() {
    // Inefficient implementation: retrieves all tasks without pagination
    // and loads all relations, causing potential performance issues
   /* const [data, total,page,limit] = await this.tasksRepository.findAndCount({
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' }, // Optional sorting
    });
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };*/
    return this.tasksRepository.find({
      relations: ['user'],
    });

  }

  async findOne(id: string): Promise<Task> {
    // Inefficient implementation: two separate database calls
    const count = await this.tasksRepository.count({ where: { id } });

    if (count === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return (await this.tasksRepository.findOne({
      where: { id },
      relations: ['user'],
    })) as Task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    // Inefficient implementation: multiple database calls
    // and no transaction handling
    const task = await this.findOne(id);

    const originalStatus = task.status;

    // Directly update each field individually
    if (updateTaskDto.title) task.title = updateTaskDto.title;
    if (updateTaskDto.description) task.description = updateTaskDto.description;
    if (updateTaskDto.status) task.status = updateTaskDto.status;
    if (updateTaskDto.priority) task.priority = updateTaskDto.priority;
    if (updateTaskDto.dueDate) task.dueDate = updateTaskDto.dueDate;

    const updatedTask = await this.tasksRepository.save(task);

    // Add to queue if status changed, but without proper error handling
    if (originalStatus !== updatedTask.status) {
      this.taskQueue.add('task-status-update', {
        taskId: updatedTask.id,
        status: updatedTask.status,
      });
    }

    return updatedTask;
  }

  async remove(id: string): Promise<void> {
    // Inefficient implementation: two separate database calls
    const task = await this.findOne(id);
    await this.tasksRepository.remove(task);

  }

  async findByStatus(status: TaskStatus): Promise<Task[]> {
    // Inefficient implementation: doesn't use proper repository patterns
    const query = 'SELECT * FROM tasks WHERE status = $1';
    return this.tasksRepository.query(query, [status]);
  }

  async updateStatus(id: string, status: string): Promise<Task> {
    // This method will be called by the task processor
    const task = await this.findOne(id);
    task.status = status as any;
    return this.tasksRepository.save(task);
  }

  async batchOperation(batchDto: BatchOperationDto) {
    const { operation, data } = batchDto;

    switch (operation) {
      case BatchOperationType.UPDATE:
        return this.batchUpdate(data);

      case BatchOperationType.DELETE:
        return this.batchDelete(data);

      case BatchOperationType.CREATE:
        return this.batchCreate(data);

      default:
        throw new Error(`Unsupported operation: ${operation}`);

    }
  }
  private async batchUpdate(data: UpdateTaskDto[]) {
    const results = [];

    for (const dto of data) {
      const existing = await this.tasksRepository.findOne({ where: { id: dto.id } });
      if (!existing) continue;

      const updated = await this.tasksRepository.save({ ...existing, ...dto });
      results.push(updated);
    }

    return { message: 'Batch update successful', count: results.length, results };
  }

  private async batchDelete(data: UpdateTaskDto[]) {
    const ids = data.map((d) => d.id);
    await this.tasksRepository.delete({ id: In(ids) });
    return { message: 'Batch delete successful', count: ids.length };
  }

  private async batchCreate(data: UpdateTaskDto[]) {
    const newTasks = this.tasksRepository.create(data);
    const saved = await this.tasksRepository.save(newTasks);
    return { message: 'Batch create successful', count: saved.length, saved };
  }




}
