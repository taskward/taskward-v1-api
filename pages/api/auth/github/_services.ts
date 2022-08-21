import axios from "axios";

import type { GitHubUserInfo } from "@interfaces";
import { GET_GITHUB_USER_URL } from "./_constants";

async function getGitHubUserInfoByAccessToken(
  accessToken: string
): Promise<GitHubUserInfo | null> {
  const user = await axios({
    method: "GET",
    url: GET_GITHUB_USER_URL,
    headers: {
      accept: "application/json;charset=utf-8",
      Authorization: `token ${accessToken}`,
    },
  });

  return user.data
    ? {
        id: user.data.id,
        login: user.data.login,
        name: user.data.name,
        email: user.data.email,
        avatarUrl: user.data.avatar_url,
        bio: user.data.bio,
        location: user.data.location,
      }
    : null;
}

export { getGitHubUserInfoByAccessToken };
