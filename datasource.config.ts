import { DataSource } from 'typeorm';
import { User } from './src/modules/users/user.entity';
import { Project } from './src/modules/projects/project.entity';
import { Task } from './src/modules/tasks/task.entity';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'task_m',
    entities: [User, Project, Task],
    migrations: ['src/migrations/*.ts'],
    synchronize: false
});
