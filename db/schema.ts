import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm/sql";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  email: text().notNull().unique(),
});

export const notesTable = pgTable("notes", {
  id: uuid()
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  note: text().notNull(),
  references: text().notNull(),
  forUser: integer()
    .notNull()
    .references(() => usersTable.id),
});
