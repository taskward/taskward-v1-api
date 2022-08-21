import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@prisma/client";
import { prisma } from "@database";

import { errorHandler, validateToken } from "@utils";
import { ERROR_405_MESSAGE } from "@constants";

const getUserInfo = async (
  request: NextApiRequest,
  response: NextApiResponse<Partial<User> | string>
) => {
  try {
    if (request.method === "OPTIONS") {
      response.status(200).end();
      return;
    }
    if (request.method !== "GET") {
      response.status(405).json(ERROR_405_MESSAGE);
      return;
    }

    const authResult = validateToken(request);
    if (!authResult) {
      response.status(401).end();
      return;
    }

    const user: Partial<User> | null = await prisma.user.findFirst({
      where: { id: authResult.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        avatarUrl: true,
        biography: true,
        location: true,
        role: true,
      },
    });

    if (!user) {
      response.status(404).end();
      return;
    }

    response.status(200).json(user);
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default getUserInfo;
