import { drizzle } from "drizzle-orm/neon-http";
import { usersTable, notesTable } from "./schema";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const createUser = async (
  name: string,
  email: string,
  clerk_id: string,
) => {
  await db.insert(usersTable).values({ name, email, clerk_id });
};

export const createNote = async (
  note: string,
  references: JSON,
  forUser: string,
) => {
  await db.insert(notesTable).values({ note, references, forUser });
};

export const getNotes = async (clerk_id: string) => {
  const notes = await db
    .select()
    .from(notesTable)
    .where(eq(notesTable.forUser, clerk_id));

  return notes;
};

export const deleteNote = async (id: string) => {
  await db.delete(notesTable).where(eq(notesTable.id, id));
};

export default db;
