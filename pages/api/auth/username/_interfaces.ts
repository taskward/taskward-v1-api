import { UserInfoModel } from "@interfaces";

interface LoginResult {
  accessToken: string;
  user: Partial<UserInfoModel>;
}

export type { LoginResult };
