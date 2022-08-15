import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { errorHandler } from "@utils";
import { POST_GITHUB_TOKEN_URL } from "./_constants";
import { getUserInfoByToken } from "./_services";
import { User } from "@interfaces";

type loginResult = {
  token: string;
  user: User | null;
};

const loginWithGitHub = async (
  request: NextApiRequest,
  response: NextApiResponse<loginResult | string>
) => {
  try {
    const requestToken = request.query.code;
    if (!requestToken) {
      response.status(401).json("Authenticate failed: No code.");
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
      response.status(401).json("Authenticate failed: Do not Have a token.");
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
