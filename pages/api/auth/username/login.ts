import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import { prisma } from "@database";
import { User } from "@prisma/client";

import { createToken, errorHandler } from "@utils";
import { ErrorModel, SuccessModel } from "@interfaces";
import { ERROR_405_MESSAGE } from "@constants";

import { LoginResult } from "./_interfaces";
import { LOGIN_FAILED, LOGIN_SUCCESS } from "./_constants";

const loginByUsername = async (
  request: NextApiRequest,
  response: NextApiResponse<(LoginResult & SuccessModel) | ErrorModel>
) => {
  try {
    if (request.method === "OPTIONS") {
      response.status(200).end();
      return;
    }
    if (request.method !== "POST") {
      response.status(405).json({ errorKey: ERROR_405_MESSAGE });
      return;
    }

    const { username, password } = request.body;

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      response.status(400).json({ errorKey: LOGIN_FAILED });
      return;
    }

    const checkPasswordSuccess = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!checkPasswordSuccess) {
      response.status(400).json({ errorKey: LOGIN_FAILED });
      return;
    }

    const generatedToken = createToken(user);

    type whatIPick = {
      password: string;
    };

    const userResult: Pick<User, keyof whatIPick> = user;

    response.status(200).json({
      successKey: LOGIN_SUCCESS,
      accessToken: generatedToken,
      user: userResult,
    });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default loginByUsername;
