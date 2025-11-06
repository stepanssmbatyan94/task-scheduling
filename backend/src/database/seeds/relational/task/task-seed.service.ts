import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task.entity';
import { TaskStatusEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task-status.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class TaskSeedService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskStatusEntity)
    private statusRepository: Repository<TaskStatusEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    const count = await this.taskRepository.count();

    if (!count) {
      // Fetch statuses by name
      const backlogStatus = await this.statusRepository.findOne({
        where: { name: 'backlog' },
      });
      const todoStatus = await this.statusRepository.findOne({
        where: { name: 'todo' },
      });
      const inProgressStatus = await this.statusRepository.findOne({
        where: { name: 'in-progress' },
      });
      const doneStatus = await this.statusRepository.findOne({
        where: { name: 'done' },
      });

      // Fetch users to assign tasks
      const users = await this.userRepository.find({
        where: { role: { id: 2 } }, // User role (admin = 1, user = 2)
        take: 5,
      });

      if (!backlogStatus || !todoStatus || !inProgressStatus || !doneStatus) {
        console.warn(
          'Task statuses not found. Please run task status seeder first.',
        );
        return;
      }

      if (users.length === 0) {
        console.warn('No users found. Please run user seeder first.');
        return;
      }

      const now = new Date();
      const tasks = [
        // 1 task with backlog status
        {
          title: 'Research new technologies',
          description:
            'Investigate and evaluate new technologies for the project',
          status: backlogStatus,
          assignedUser: users[0] || null,
          startDate: null,
          endDate: null,
        },
        // 2 tasks with todo status
        {
          title: 'Design user interface',
          description: 'Create wireframes and mockups for the user interface',
          status: todoStatus,
          assignedUser: users[0] || null,
          startDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
        {
          title: 'Set up development environment',
          description: 'Configure development tools and environment setup',
          status: todoStatus,
          assignedUser: users[1] || null,
          startDate: null,
          endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        },
        // 3 tasks with in-progress status
        {
          title: 'Implement authentication system',
          description: 'Develop user authentication and authorization features',
          status: inProgressStatus,
          assignedUser: users[0] || null,
          startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        },
        {
          title: 'Create API endpoints',
          description: 'Build RESTful API endpoints for task management',
          status: inProgressStatus,
          assignedUser: users[1] || null,
          startDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Yesterday
          endDate: null,
        },
        {
          title: 'Write unit tests',
          description: 'Create comprehensive unit tests for core functionality',
          status: inProgressStatus,
          assignedUser: users[2] || null,
          startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        },
        // 2 tasks with done status
        {
          title: 'Project planning and requirements',
          description: 'Complete project planning and gather all requirements',
          status: doneStatus,
          assignedUser: users[0] || null,
          startDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          endDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
          title: 'Database schema design',
          description: 'Design and create database schema for the application',
          status: doneStatus,
          assignedUser: users[1] || null,
          startDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          endDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      ];

      await this.taskRepository.save(
        tasks.map((task) =>
          this.taskRepository.create({
            ...task,
            assignedUserId: task.assignedUser?.id || null,
            statusId: task.status.id,
          }),
        ),
      );
    }
  }
}
