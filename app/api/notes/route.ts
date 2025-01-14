import { getNotes } from "@/db/index";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  let notes;

  if (user) {
    notes = await getNotes(user.id);
  }

  return Response.json(notes, { status: 200 });
}
