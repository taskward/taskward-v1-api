import axios from "axios";
import type { User } from "@interfaces";
import { GET_GITHUB_USER_URL } from "./_constants";

async function getUserInfoByToken(token: string): Promise<User | null> {
  const user = await axios({
    method: "GET",
    url: GET_GITHUB_USER_URL,
    headers: {
      accept: "application/json;charset=utf-8",
      Authorization: `token ${token}`,
    },
  });
  return user.data
    ? {
        id: user.data.id,
        name: user.data.name ?? user.data.login,
        avatarUrl: user.data.avatar_url,
        biography: user.data.bio,
        email: user.data.email,
        location: user.data.location,
      }
    : null;
}

export { getUserInfoByToken };
