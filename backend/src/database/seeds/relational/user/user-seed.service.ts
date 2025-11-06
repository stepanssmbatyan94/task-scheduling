import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password,
          role: {
            id: RoleEnum.admin,
            name: 'Admin',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.user,
        },
      },
    });

    if (!countUser) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const users = [
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
        },
        {
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@example.com',
        },
        {
          firstName: 'Emily',
          lastName: 'Williams',
          email: 'emily.williams@example.com',
        },
        {
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@example.com',
        },
      ];

      await this.repository.save(
        users.map((user) =>
          this.repository.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password,
            role: {
              id: RoleEnum.user,
              name: 'User',
            },
            status: {
              id: StatusEnum.active,
              name: 'Active',
            },
          }),
        ),
      );
    }
  }
}
