import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMessagesTable1794168332712 implements MigrationInterface {
  name = 'CreateMessagesTable1794168332712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "messages_status_enum" AS ENUM ('pending', 'read', 'archived')`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "content" text NOT NULL, "status" "messages_status_enum" NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_18325f38ae6de43878487eff" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_befd307485dbf0559d17e4a" ON "messages" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_befd307485dbf0559d17e4a"`,
    );
    await queryRunner.query(`DROP TABLE "messages"`);
    await queryRunner.query(`DROP TYPE "messages_status_enum"`);
  }
}
