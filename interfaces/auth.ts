import type { Role } from "@prisma/client";

interface AuthModel {
  username: string;
  userId: number;
  role: Role;
}

export type { AuthModel };
