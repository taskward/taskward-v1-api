import { User } from "@prisma/client";

interface LoginResult {
  accessToken: string;
  user: Partial<User>;
}

export type { LoginResult };
