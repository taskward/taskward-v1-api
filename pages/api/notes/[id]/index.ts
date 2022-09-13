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

    if (request.method !== "PUT" && request.method !== "DELETE") {
      response.status(405).end();
      return;
    }

    // Validate token
    const authResult = validateToken(request);
    if (!authResult) {
      response.status(401).end();
      return;
    }

    const { id: noteId } = request.query;
    const { name, description, tasks: tasksData } = request.body;

    if (!noteId || isNaN(Number(noteId)) || Number(noteId) <= 0) {
      response.status(400).end();
      return;
    }

    if (request.method === "PUT") {
      // Check whether the note has tasks
      try {
        await prisma.note.update({
          where: { id: Number(noteId) },
          data: {
            tasks: { deleteMany: {} },
          },
        });
        if (tasksData && tasksData.length > 0) {
          const tasks = tasksData.map((task: any) => {
            return {
              id: task.id,
              content: task.content,
              linkUrl: task.linkUrl,
              finishedAt: task.finished ? new Date().toISOString() : null,
            };
          });
          await prisma.note.update({
            where: { id: Number(noteId) },
            data: {
              name: name,
              description: description,
            },
          });
          tasks.forEach(async (task: any) => {
            await prisma.task.create({
              data: {
                content: task.content,
                linkUrl: task.linkUrl,
                finishedAt: task.finishedAt,
                noteId: Number(noteId),
              },
            });
          });
        } else {
          await prisma.note.update({
            where: { id: Number(noteId) },
            data: {
              name: name,
              description: description,
            },
          });
        }
      } catch (error) {
        errorHandler(error);
        response.status(404).end();
        return;
      }

      response.status(200).end();
      return;
    } else if (request.method === "DELETE") {
      const { count } = await prisma.note.deleteMany({
        where: {
          id: Number(noteId),
        },
      });

      if (count === 0) {
        response.status(404).end();
        return;
      }

      response.status(200).end();
      return;
    }
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default handler;
