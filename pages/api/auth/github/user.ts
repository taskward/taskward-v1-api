import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@prisma/client";

import { errorHandler } from "@utils";
import { ERROR_405_MESSAGE } from "@constants";

import { getGitHubUserInfoByAccessToken } from "./_services";
import { ERROR_401_MESSAGE_NO_TOKEN } from "./_constants";

const getUserByToken = async (
  request: NextApiRequest,
  response: NextApiResponse<{ userInfo: User | null } | string>
) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json(ERROR_405_MESSAGE);
      return;
    }
    if (
      !request.headers.authorization ||
      request.headers.authorization?.split(" ")[0] !== "gt"
    ) {
      response.status(401).json(ERROR_401_MESSAGE_NO_TOKEN);
      return;
    }

    const githubToken = request.headers.authorization.split(" ")[1];
    if (!githubToken) {
      response.status(401).json(ERROR_401_MESSAGE_NO_TOKEN);
      return;
    }

    const userInfo = await getGitHubUserInfoByAccessToken(githubToken);

    response.status(200).json({
      userInfo: null,
    });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default getUserByToken;
