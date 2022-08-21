import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import stringRandom from "string-random";

import { prisma } from "@database";
import { AuthType, User } from "@prisma/client";

import { errorHandler, createToken } from "@utils";
import { ErrorModel } from "@interfaces";
import { ERROR_405_MESSAGE } from "@constants";

import { getGitHubUserInfoByAccessToken } from "./_services";
import {
  POST_GITHUB_TOKEN_URL,
  ERROR_401_MESSAGE_NO_TOKEN,
} from "./_constants";

interface LoginResult {
  accessToken: string;
  user: User;
}

const loginWithGitHub = async (
  request: NextApiRequest,
  response: NextApiResponse<LoginResult | ErrorModel>
) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json({ errorKey: ERROR_405_MESSAGE });
      return;
    }

    const requestCode = request.query.code;

    if (!requestCode) {
      response.status(401).json({ errorKey: ERROR_401_MESSAGE_NO_TOKEN });
      return;
    }

    const tokenResponse = await axios({
      method: "POST",
      url:
        POST_GITHUB_TOKEN_URL +
        `?client_id=${process.env.GITHUB_CLIENT_ID}&` +
        `client_secret=${process.env.GITHUB_CLIENT_SECRET}&` +
        `code=${requestCode}`,
      headers: {
        accept: "application/json;charset=utf-8",
      },
    });

    if (!tokenResponse.data.access_token) {
      response.status(401).json({ errorKey: ERROR_401_MESSAGE_NO_TOKEN });
      return;
    }

    const accessToken = tokenResponse.data.access_token;

    // Get GitHub user info
    const githubUserInfo = await getGitHubUserInfoByAccessToken(
      tokenResponse.data.access_token
    );

    if (!githubUserInfo) {
      response.status(404).json({ errorKey: "NotFound" });
      return;
    }

    // Check auth info
    const auth = await prisma.auth.findFirst({
      include: { User: true },
      where: {
        authType: AuthType.GITHUB,
        openId: githubUserInfo.id,
      },
    });

    if (auth) {
      // Change AccessToken
      const shouldChangeAccessToken: boolean = auth.accessToken !== accessToken;
      shouldChangeAccessToken &&
        (await prisma.auth.update({
          where: { id: auth.id },
          data: {
            accessToken: accessToken,
          },
        }));

      const generatedToken: string = createToken(auth.User);

      response.status(200).json({
        accessToken: generatedToken,
        user: auth.User,
      });
    } else {
      // Insert a user and auth
      const user: User = await prisma.user.create({
        data: {
          username: "User-" + stringRandom(8),
          email: githubUserInfo.email,
          name: githubUserInfo.name ?? githubUserInfo.login,
          avatarUrl: githubUserInfo.avatarUrl,
          biography: githubUserInfo.bio,
          location: githubUserInfo.location,
          auths: {
            create: {
              authType: AuthType.GITHUB,
              accessToken: accessToken,
              openId: githubUserInfo.id,
            },
          },
        },
      });

      const generatedToken: string = createToken(user);

      response.status(200).json({
        accessToken: generatedToken,
        user: user,
      });
    }
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default loginWithGitHub;
