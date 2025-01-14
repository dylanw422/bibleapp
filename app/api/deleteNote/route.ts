import { deleteNote } from "@/db";

export async function POST(req: Request) {
  const { id } = await req.json();

  await deleteNote(id);

  return Response.json(
    { message: "Note deleted successfully." },
    {
      status: 200,
    },
  );
}
