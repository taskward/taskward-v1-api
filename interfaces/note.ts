import type { Note, Task } from '@prisma/client'

type PickedNoteListField =
  | 'id'
  | 'name'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
  | 'priority'
  | 'index'
  | 'toped'

type PickedTaskListField =
  | 'id'
  | 'content'
  | 'linkUrl'
  | 'createdAt'
  | 'updatedAt'
  | 'finishedAt'
  | 'index'

type NoteListModel = Pick<Note, PickedNoteListField> & {
  tasks: Pick<Task, PickedTaskListField>[]
}

type PickedTrashNoteListField =
  | 'id'
  | 'name'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'

type TrashNoteListModel = Pick<Note, PickedTrashNoteListField> & {
  tasks: Pick<Task, PickedTaskListField>[]
}

export type { NoteListModel, TrashNoteListModel }
