import { MigrationInterface, QueryRunner } from 'typeorm'

export class generatedMigration1679046107116 implements MigrationInterface {
  name = 'generatedMigration1679046107116'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 'ADMIN', 'NON_BINARY', 'OTHER')`)
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER')`)
    await queryRunner.query(
      `CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "tax_id" character varying NOT NULL, "birthday" date NOT NULL, "gender" "public"."users_gender_enum" NOT NULL, "role" "public"."users_role_enum" NOT NULL, "address" character varying, "complement" character varying, "neighborhood" character varying, "number" character varying, "zip_code" character varying, "home_phone" character varying, "work_phone" character varying, "cell_phone" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`)
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`)
  }
}
