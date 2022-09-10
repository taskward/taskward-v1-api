import { Prisma } from "@prisma/client";

const softDeleteModels: Partial<Prisma.ModelName>[] = [
  "User",
  "Auth",
  "Note",
  "Tag",
  "Theme",
];

export { softDeleteModels };
