import { createNote } from "@/db/index";

export async function POST(req: Request) {
  const { note, references, forUser } = await req.json();

  await createNote(note, references, forUser);

  return Response.json(
    { message: "Note added successfully!" },
    { status: 200 },
  );
}
