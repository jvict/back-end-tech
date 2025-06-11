import { defineConfig } from 'drizzle-kit'

if(!process.env.DATABASE_URL){
    throw new Error('DATABASE_URL must be configured');
}

export default defineConfig({
 schema: './src/infra/schema.ts',
  out: './migrations',
  dbCredentials: {
    user: 'ilumeo',
    password: 'ilumeo',
    database: 'ilumeo',
    host: 'db',
    port: 5432
  },
  dialect: 'postgresql'
})