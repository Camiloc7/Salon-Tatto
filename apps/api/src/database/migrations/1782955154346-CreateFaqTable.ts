import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFaqTable1782955154346 implements MigrationInterface {
    name = 'CreateFaqTable1782955154346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "faq_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "faqId" uuid NOT NULL, "languageId" uuid NOT NULL, "question" character varying NOT NULL, "answer" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a9edd77248eed506f2e2600d9c9" UNIQUE ("faqId", "languageId"), CONSTRAINT "PK_f2461821714475f28830d6051bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faqs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "faq_translations" ADD CONSTRAINT "FK_569aa44e52def4a6a43d6cb9eb3" FOREIGN KEY ("faqId") REFERENCES "faqs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "faq_translations" ADD CONSTRAINT "FK_10349b63813abe4656c20ada2a4" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faq_translations" DROP CONSTRAINT "FK_10349b63813abe4656c20ada2a4"`);
        await queryRunner.query(`ALTER TABLE "faq_translations" DROP CONSTRAINT "FK_569aa44e52def4a6a43d6cb9eb3"`);
        await queryRunner.query(`DROP TABLE "faqs"`);
        await queryRunner.query(`DROP TABLE "faq_translations"`);
    }

}
