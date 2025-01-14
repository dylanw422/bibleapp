import { integer, pgTable, text, uuid, json } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  clerk_id: text().notNull().unique(),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const notesTable = pgTable("notes", {
  id: uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  note: text().notNull(),
  references: json().notNull(),
  forUser: text()
    .notNull()
    .references(() => usersTable.clerk_id),
});
