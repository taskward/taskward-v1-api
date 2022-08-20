import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { errorHandler } from "@utils";
import {
  POST_GITHUB_TOKEN_URL,
  ERROR_401_MESSAGE_NO_TOKEN,
} from "./_constants";
import { getUserInfoByToken } from "./_services";
import { User } from "@interfaces";
import { ERROR_405_MESSAGE } from "@constants";

type loginResult = {
  token: string;
  user: User | null;
};

const loginWithGitHub = async (
  request: NextApiRequest,
  response: NextApiResponse<loginResult | string>
) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json(ERROR_405_MESSAGE);
      return;
    }

    const requestToken = request.query.code;

    if (!requestToken) {
      response.status(401).json(ERROR_401_MESSAGE_NO_TOKEN);
      return;
    }

    const tokenResponse = await axios({
      method: "POST",
      url:
        POST_GITHUB_TOKEN_URL +
        `?client_id=${process.env.GITHUB_CLIENT_ID}&` +
        `client_secret=${process.env.GITHUB_CLIENT_SECRET}&` +
        `code=${requestToken}`,
      headers: {
        accept: "application/json;charset=utf-8",
      },
    });

    if (!tokenResponse.data.access_token) {
      response.status(401).json(ERROR_401_MESSAGE_NO_TOKEN);
      return;
    }

    const userInfo = await getUserInfoByToken(tokenResponse.data.access_token);

    response.status(200).json({
      token: tokenResponse.data.access_token,
      user: userInfo,
    });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default loginWithGitHub;
