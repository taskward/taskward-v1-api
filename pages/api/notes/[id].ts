import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "@database";

import { errorHandler, isNumber, validateToken } from "@utils";
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
    // const authResult = validateToken(request);
    // if (!authResult) {
    //   response.status(401).end();
    //   return;
    // }

    if (request.method === "PUT") {
      const { id: noteId } = request.query;
      const { name, description, userId } = request.body;
      console.log(typeof noteId);
      if (!noteId || !isNumber(noteId) || noteId <= 0) {
        response.status(400).end();
        return;
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          notes: {
            update: {
              where: { id: noteId },
              data: {
                name: name,
                description: description,
              },
            },
          },
        },
      });
      console.log(updated);

      response.status(200).send({ successKey: "Success" });
      return;
    } else if (request.method === "DELETE") {
    }
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default handler;
