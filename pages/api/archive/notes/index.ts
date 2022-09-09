import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@database";
import { errorHandler, validateToken } from "@utils";
import { ErrorModel, SuccessModel } from "@interfaces";

import { NoteListResult } from "./_interfaces";

const handler = async (
  request: NextApiRequest,
  response: NextApiResponse<
    (NoteListResult & SuccessModel) | SuccessModel | ErrorModel
  >
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

    // Validate token
    const authResult = validateToken(request);
    if (!authResult) {
      response.status(401).end();
      return;
    }

    if (request.method === "GET") {
      const notes = await prisma.note.findMany({
        where: { userId: authResult.userId, archived: true },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          priority: true,
          index: true,
          toped: true,
          tasks: {
            select: {
              id: true,
              content: true,
              linkUrl: true,
              finishedAt: true,
              createdAt: true,
              updatedAt: true,
              index: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      response.status(200).json({ notes: notes, count: notes.length });
    }
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default handler;
