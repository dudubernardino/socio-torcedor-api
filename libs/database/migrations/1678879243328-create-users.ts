import { MigrationInterface, QueryRunner } from 'typeorm'

export class generatedMigration1678879243328 implements MigrationInterface {
  name = 'generatedMigration1678879243328'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "cpfCnpj" character varying NOT NULL, "data_nascimento" character varying NOT NULL, "endereco" character varying NOT NULL, "complemento" character varying NOT NULL, "bairro" character varying NOT NULL, "numero" character varying NOT NULL, "cep" character varying NOT NULL, "telefone_residencial" character varying, "telefone_comercial" character varying, "telefone_celular" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
