import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@database";

import { errorHandler, validateToken } from "@utils";
import { ErrorModel, SuccessModel } from "@interfaces";

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<SuccessModel | ErrorModel>
) => {
  try {
    if (request.method === "OPTIONS") {
      response.status(200).end();
      return;
    }
    if (request.method !== "GET" && request.method !== "PUT") {
      response.status(405).end();
      return;
    }
    if (request.method === "PUT") {
      const authResult = validateToken(request);
      if (!authResult) {
        response.status(401).end();
        return;
      }

      const { name, description } = request.body;

      const note = await prisma.note.create({
        data: {
          name: name,
          description: description,
          userId: authResult.userId,
        },
      });

      if (!note) {
        response.status(404).end();
        return;
      }
    }
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default handler;
