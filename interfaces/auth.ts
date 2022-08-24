import type { User, Role } from "@prisma/client";

interface AuthModel {
  username: string;
  userId: number;
  role: Role;
}

type PickedUserInfo =
  | "id"
  | "username"
  | "email"
  | "name"
  | "avatarUrl"
  | "biography"
  | "location"
  | "role";

type UserInfoModel = Pick<User, PickedUserInfo>;

export type { AuthModel, UserInfoModel };
