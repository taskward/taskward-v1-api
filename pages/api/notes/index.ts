import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@database";
import { errorHandler, validateToken } from "@utils";
import { ErrorModel, SuccessModel } from "@interfaces";

import { NoteListResult } from "./_interfaces";
import { NOTE_CREATE_SUCCESS } from "./_constants";

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
    if (request.method !== "GET" && request.method !== "POST") {
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
        where: { userId: authResult.userId, archived: false },
        select: {
          id: true,
          name: true,
          description: true,
          updatedAt: true,
          priority: true,
          index: true,
          toped: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      response.status(200).json({ notes: notes, count: notes.length });
    } else if (request.method === "POST") {
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

      response.status(200).json({
        successKey: NOTE_CREATE_SUCCESS,
      });
    }
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default handler;
