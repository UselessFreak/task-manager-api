import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskAssignees1738917936718 implements MigrationInterface {
    name = 'AddTaskAssignees1738917936718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_0141288f2306f20da9a60ec8d6" ON "task_assignees" ("task_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb8051e376a2b083e074678cb6" ON "task_assignees" ("user_id") `);

        await queryRunner.query(`ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_0141288f2306f20da9a60ec8d69" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_assignees" ADD CONSTRAINT "FK_bb8051e376a2b083e074678cb60" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_bb8051e376a2b083e074678cb60"`);
        await queryRunner.query(`ALTER TABLE "task_assignees" DROP CONSTRAINT "FK_0141288f2306f20da9a60ec8d69"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb8051e376a2b083e074678cb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0141288f2306f20da9a60ec8d6"`);
    }
}
