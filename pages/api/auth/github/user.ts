import type { NextApiRequest, NextApiResponse } from "next";
import { errorHandler } from "@utils";
import { getUserInfoByToken } from "./_services";
import { User } from "@interfaces";

const getUserByToken = async (
  request: NextApiRequest,
  response: NextApiResponse<{ userInfo: User | null } | string>
) => {
  try {
    if (
      !request.headers.authorization ||
      request.headers.authorization?.split(" ")[0] !== "gt"
    ) {
      response.status(401).json("Authenticate failed: Do not Have a token.");
      return;
    }

    const githubToken = request.headers.authorization.split(" ")[1];
    if (!githubToken) {
      response.status(401).json("Authenticate failed: No token.");
      return;
    }

    const userInfo = await getUserInfoByToken(githubToken);

    response.status(200).json({
      userInfo,
    });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default getUserByToken;
