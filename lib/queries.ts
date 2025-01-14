import axios from "axios";

export const getNotes = async () => {
  const res = await axios.get("/api/notes");

  return res.data;
};

export const deleteNoteQuery = async (id: string | null) => {
  return await axios.post("/api/deleteNote", { id });
};
