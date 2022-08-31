import type { Note } from "@prisma/client";

type PickedNoteListField =
  | "id"
  | "name"
  | "description"
  | "createdAt"
  | "updatedAt"
  | "priority"
  | "index"
  | "toped";

type NoteListModel = Pick<Note, PickedNoteListField>;

type PickedTrashNoteListField =
  | "id"
  | "name"
  | "description"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";

type TrashNoteListModel = Pick<Note, PickedTrashNoteListField>;

export type { NoteListModel, TrashNoteListModel };
