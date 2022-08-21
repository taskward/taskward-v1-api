import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import { prisma } from "@database";

import { createToken, errorHandler } from "@utils";
import { ERROR_405_MESSAGE } from "@constants";

import { LOGIN_FAILED, LOGIN_SUCCESS } from "./_constants";

const loginByUsername = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  try {
    if (request.method !== "POST") {
      response.status(405).json(ERROR_405_MESSAGE);
      return;
    }

    const { username, password } = request.body;

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      response.status(400).json(LOGIN_FAILED);
      return;
    }

    const checkPasswordSuccess = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!checkPasswordSuccess) {
      response.status(400).json(LOGIN_FAILED);
      return;
    }
    const accessToken = createToken(user);

    response.status(200).json({ successKey: LOGIN_SUCCESS, accessToken });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default loginByUsername;
