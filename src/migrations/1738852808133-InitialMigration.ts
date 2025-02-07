import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1738852808133 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR UNIQUE NOT NULL,
                password VARCHAR NOT NULL,
                name VARCHAR,
                role VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS projects (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR NOT NULL,
                description TEXT,
                owner_id UUID REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS tasks (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR NOT NULL,
                description TEXT,
                status VARCHAR NOT NULL,
                project_id UUID REFERENCES projects(id),
                assignee_id UUID REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаление таблиц в обратном порядке
        await queryRunner.query(`
            DROP TABLE IF EXISTS tasks;
            DROP TABLE IF EXISTS projects;
            DROP TABLE IF EXISTS users;
        `);
    }
}
