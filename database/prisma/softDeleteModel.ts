import { Prisma } from "@prisma/client";

const softDeleteModels: Partial<Prisma.ModelName>[] = [
  "User",
  "Auth",
  "Note",
  "Task",
  "Tag",
  "Theme",
];

export { softDeleteModels };
