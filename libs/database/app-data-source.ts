import { DataSource } from 'typeorm'

const datasource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  username: process.env.POSTGRES_USER || 'iniciador_user',
  password: process.env.POSTGRES_PASSWORD || 'magical_password',
  database: process.env.POSTGRES_DB || 'socio_db',
  migrations: ['libs/database/migrations/**/*.ts'],
  migrationsRun: true,
  parseInt8: true,
})

datasource.initialize()

export default datasource
