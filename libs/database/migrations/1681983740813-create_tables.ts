import { MigrationInterface, QueryRunner } from "typeorm";

export class generatedMigration1681983740813 implements MigrationInterface {
    name = 'generatedMigration1681983740813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stadiums" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_fa5fb6b39622ba448ddbb198e03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "matches" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stadium_id" uuid NOT NULL, "team_id" uuid NOT NULL, "home_team" character varying NOT NULL, "home_team_score" integer, "away_team" character varying NOT NULL, "away_team_score" integer, "start_time" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_8a22c7b2e0828988d51256117f4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "checkins" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sector_id" uuid NOT NULL, "user_id" uuid NOT NULL, "match_id" uuid NOT NULL, "checkinTime" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_99c62633386398b154840f0708c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stadiums_sector" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stadium_id" uuid NOT NULL, "name" character varying NOT NULL, "capacity" integer NOT NULL, "checkin_limit" integer NOT NULL, CONSTRAINT "PK_24794796135a1368bafd9a08fd1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plans" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "team_id" uuid, "description" character varying, "price" numeric(10,2) NOT NULL, CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."membership_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'CANCELED', 'PENDING', 'REJECTED', 'OVERDUE')`);
        await queryRunner.query(`CREATE TABLE "membership" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "plan_id" uuid NOT NULL, "user_id" uuid NOT NULL, "team_id" uuid NOT NULL, "payment_id" integer NOT NULL, "status" "public"."membership_status_enum" NOT NULL, "payment_method" character varying NOT NULL, "registration_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "due_date" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_83c1afebef3059472e7c37e8de8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('MALE', 'ADMIN', 'NON_BINARY', 'OTHER')`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER')`);
        await queryRunner.query(`CREATE TABLE "users" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team_id" uuid, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "tax_id" character varying NOT NULL, "birthday" date, "gender" "public"."users_gender_enum", "role" "public"."users_role_enum" NOT NULL, "address" character varying, "complement" character varying, "neighborhood" character varying, "number" character varying, "zip_code" character varying, "home_phone" character varying, "work_phone" character varying, "cell_phone" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "trade_name" character varying, "email" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "main_color" character varying, "avatar" character varying, "tax_id" character varying NOT NULL, "fee" integer NOT NULL DEFAULT '0', "description" text, CONSTRAINT "UQ_2195007977b1b9cf76ad224324c" UNIQUE ("email"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "applications" ("created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team_id" uuid NOT NULL, "name" character varying, "description" character varying, "clientId" character varying NOT NULL, "secret" character varying NOT NULL, "salt" character varying, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plans_sectors_stadiums_sector" ("plansId" uuid NOT NULL, "stadiumsSectorId" uuid NOT NULL, CONSTRAINT "PK_5f97d155af7f3e2d3f77c864532" PRIMARY KEY ("plansId", "stadiumsSectorId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_80b4ece8fd1ff8e36761c6a1d2" ON "plans_sectors_stadiums_sector" ("plansId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a40cd55bf7d366dbc50c7acde3" ON "plans_sectors_stadiums_sector" ("stadiumsSectorId") `);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_f78a661415b0c75f087c6d026be" FOREIGN KEY ("stadium_id") REFERENCES "stadiums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "matches" ADD CONSTRAINT "FK_58b365500eeb20dc491cb97ce2b" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkins" ADD CONSTRAINT "FK_4bee1e59fa58838948f443e531f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkins" ADD CONSTRAINT "FK_3213e649effc1145ff110bfd8ec" FOREIGN KEY ("sector_id") REFERENCES "stadiums_sector"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "checkins" ADD CONSTRAINT "FK_1ef09fd35920631018b90904c71" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stadiums_sector" ADD CONSTRAINT "FK_eabd683b4d515319ff99e21bcde" FOREIGN KEY ("stadium_id") REFERENCES "stadiums"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plans" ADD CONSTRAINT "FK_acef5551d96546d7755bf7d3967" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_e9c72e8d29784031c96f5c6af8d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_e270c516189a3f2609c413ca451" FOREIGN KEY ("plan_id") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "membership" ADD CONSTRAINT "FK_b03fe5cd64dbd43afdc8ee69e61" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "applications" ADD CONSTRAINT "FK_a36ed02953077f408d0f3ebc424" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plans_sectors_stadiums_sector" ADD CONSTRAINT "FK_80b4ece8fd1ff8e36761c6a1d22" FOREIGN KEY ("plansId") REFERENCES "plans"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "plans_sectors_stadiums_sector" ADD CONSTRAINT "FK_a40cd55bf7d366dbc50c7acde36" FOREIGN KEY ("stadiumsSectorId") REFERENCES "stadiums_sector"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "plans_sectors_stadiums_sector" DROP CONSTRAINT "FK_a40cd55bf7d366dbc50c7acde36"`);
        await queryRunner.query(`ALTER TABLE "plans_sectors_stadiums_sector" DROP CONSTRAINT "FK_80b4ece8fd1ff8e36761c6a1d22"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP CONSTRAINT "FK_a36ed02953077f408d0f3ebc424"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_1208ee1db5ddb64b48a86b46a61"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_b03fe5cd64dbd43afdc8ee69e61"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_e270c516189a3f2609c413ca451"`);
        await queryRunner.query(`ALTER TABLE "membership" DROP CONSTRAINT "FK_e9c72e8d29784031c96f5c6af8d"`);
        await queryRunner.query(`ALTER TABLE "plans" DROP CONSTRAINT "FK_acef5551d96546d7755bf7d3967"`);
        await queryRunner.query(`ALTER TABLE "stadiums_sector" DROP CONSTRAINT "FK_eabd683b4d515319ff99e21bcde"`);
        await queryRunner.query(`ALTER TABLE "checkins" DROP CONSTRAINT "FK_1ef09fd35920631018b90904c71"`);
        await queryRunner.query(`ALTER TABLE "checkins" DROP CONSTRAINT "FK_3213e649effc1145ff110bfd8ec"`);
        await queryRunner.query(`ALTER TABLE "checkins" DROP CONSTRAINT "FK_4bee1e59fa58838948f443e531f"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_58b365500eeb20dc491cb97ce2b"`);
        await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_f78a661415b0c75f087c6d026be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a40cd55bf7d366dbc50c7acde3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_80b4ece8fd1ff8e36761c6a1d2"`);
        await queryRunner.query(`DROP TABLE "plans_sectors_stadiums_sector"`);
        await queryRunner.query(`DROP TABLE "applications"`);
        await queryRunner.query(`DROP TABLE "teams"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "membership"`);
        await queryRunner.query(`DROP TYPE "public"."membership_status_enum"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "stadiums_sector"`);
        await queryRunner.query(`DROP TABLE "checkins"`);
        await queryRunner.query(`DROP TABLE "matches"`);
        await queryRunner.query(`DROP TABLE "stadiums"`);
    }

}
