import { pgTable, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";

export const usersSurveysResponsesAux = pgTable('users_surveys_responses_aux', {
  id: text().primaryKey(),
  origin: varchar('origin', { length: 64 }).notNull(),
  responseStatusId: integer('response_status_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
});