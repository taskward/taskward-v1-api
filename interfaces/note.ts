import type { Note } from "@prisma/client";

type PickedNoteListField =
  | "id"
  | "name"
  | "description"
  | "updatedAt"
  | "priority"
  | "index"
  | "toped";

type NoteListModel = Pick<Note, PickedNoteListField>;

export type { NoteListModel };
