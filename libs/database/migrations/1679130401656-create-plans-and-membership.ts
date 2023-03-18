import { MigrationInterface, QueryRunner } from "typeorm";

export class generatedMigration1679130401656 implements MigrationInterface {
    name = 'generatedMigration1679130401656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plans" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."membership_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'CANCELED', 'OVERDUE')`);
        await queryRunner.query(`CREATE TYPE "public"."membership_payment_method_enum" AS ENUM('CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'PIX')`);
        await queryRunner.query(`CREATE TABLE "membership" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan_id" uuid NOT NULL, "status" "public"."membership_status_enum" NOT NULL, "payment_method" "public"."membership_payment_method_enum" NOT NULL, "registration_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_e270c516189a3f2609c413ca451" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_e270c516189a3f2609c413ca451"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`DROP TYPE "public"."membership_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."membership_status_enum"`);
        await queryRunner.query(`DROP TABLE "plans"`);
    }

}
