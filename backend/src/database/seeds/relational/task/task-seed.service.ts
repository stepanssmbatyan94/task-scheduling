import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task.entity';
import { TaskStatusEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/task-status.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { UserAvailabilityEntity } from '../../../../tasks/infrastructure/persistence/relational/entities/user-availability.entity';
import { RoleEnum } from '../../../../roles/roles.enum';

@Injectable()
export class TaskSeedService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    @InjectRepository(TaskStatusEntity)
    private statusRepository: Repository<TaskStatusEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserAvailabilityEntity)
    private userAvailabilityRepository: Repository<UserAvailabilityEntity>,
  ) {}

  async run() {
    const count = await this.taskRepository.count();

    if (!count) {
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

      const users = await this.userRepository.find({
        where: { role: { id: RoleEnum.user } },
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
      const daysFromNow = (days: number) =>
        new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const backlogTasks = [
        {
          title: 'Research new technologies',
          description:
            'Investigate and evaluate new technologies for the project',
          status: backlogStatus,
          assignedUser: users[0] || null,
          startDate: daysFromNow(-1),
          endDate: daysFromNow(0),
        },
      ];

      const todoTasks = [
        {
          title: 'Design user interface',
          description: 'Create wireframes and mockups for the user interface',
          status: todoStatus,
          assignedUser: users[0] || null,
          startDate: daysFromNow(1),
          endDate: daysFromNow(5),
        },
        {
          title: 'Set up development environment',
          description: 'Configure development tools and environment setup',
          status: todoStatus,
          assignedUser: users[1] || null,
          startDate: daysFromNow(2),
          endDate: daysFromNow(4),
        },
      ];

      const inProgressTasks = [
        {
          title: 'Implement authentication system',
          description: 'Develop user authentication and authorization features',
          status: inProgressStatus,
          assignedUser: users[0] || null,
          startDate: daysFromNow(-20),
          endDate: daysFromNow(-10),
        },
        {
          title: 'Create API endpoints',
          description: 'Build RESTful API endpoints for task management',
          status: inProgressStatus,
          assignedUser: users[1] || null,
          startDate: daysFromNow(-1),
          endDate: daysFromNow(1),
        },
        {
          title: 'Write unit tests',
          description: 'Create comprehensive unit tests for core functionality',
          status: inProgressStatus,
          assignedUser: users[2] || null,
          startDate: daysFromNow(-3),
          endDate: daysFromNow(2),
        },
      ];

      const doneTasks = [
        {
          title: 'Project planning and requirements',
          description: 'Complete project planning and gather all requirements',
          status: doneStatus,
          assignedUser: users[0] || null,
          startDate: daysFromNow(-10),
          endDate: daysFromNow(-5),
        },
        {
          title: 'Database schema design',
          description: 'Design and create database schema for the application',
          status: doneStatus,
          assignedUser: null,
          startDate: daysFromNow(-8),
          endDate: daysFromNow(-3),
        },
      ];

      const tasks = [
        ...backlogTasks,
        ...todoTasks,
        ...inProgressTasks,
        ...doneTasks,
      ];

      const savedTasks = await this.taskRepository.save(
        tasks.map((task) =>
          this.taskRepository.create({
            title: task.title,
            description: task.description,
            statusId: task.status.id,
          }),
        ),
      );

      const availabilityPayload = tasks
        .map((task, index) => {
          const userId = task.assignedUser
            ? Number(task.assignedUser.id)
            : null;
          const startDate = task.startDate ?? null;
          const endDate = task.endDate ?? null;
          if (!userId && !startDate && !endDate) {
            return undefined;
          }

          return this.userAvailabilityRepository.create({
            taskId: savedTasks[index].id,
            userId,
            startDate,
            endDate,
          });
        })
        .filter(
          (availability): availability is UserAvailabilityEntity =>
            availability !== undefined,
        );

      if (availabilityPayload.length) {
        await this.userAvailabilityRepository.save(availabilityPayload);
      }
    }
  }
}
