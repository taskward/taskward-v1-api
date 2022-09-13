import type { NextApiRequest, NextApiResponse } from "next";

import { User } from "@prisma/client";
import { prisma } from "@database";

import { errorHandler, validateToken } from "@utils";
import { ErrorModel } from "@interfaces";

const getUserInfo = async (
  request: NextApiRequest,
  response: NextApiResponse<Partial<User> | ErrorModel>
) => {
  try {
    if (request.method === "OPTIONS") {
      response.status(200).end();
      return;
    }
    if (request.method !== "GET") {
      response.status(405).end();
      return;
    }

    const authResult = validateToken(request);
    if (!authResult) {
      response.status(401).end();
      return;
    }

    const user: Partial<User> | null = await prisma.user.findFirst({
      where: { id: authResult.userId, deletedAt: null },
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
