import type { User, Role } from "@prisma/client";

interface JWTUserModel {
  username: string;
  userId: number;
  role: Role;
}

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

export type { JWTUserModel, AuthModel, UserInfoModel };
