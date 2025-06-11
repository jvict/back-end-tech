import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL must be configured");
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
export const db = drizzle(client);     // Para ORM tipado (se/quando quiser)
export { client };                    // Para SQL cru/casos especiais