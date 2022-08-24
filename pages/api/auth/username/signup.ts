import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import { prisma } from "@database";
import { User } from "@prisma/client";

import { errorHandler } from "@utils";
import { ErrorModel, ValidationModel } from "@interfaces";
import { ERROR_405_MESSAGE } from "@constants";

import { signInValidation } from "./_services";
import { SuccessModel } from "@interfaces";
import { SIGN_UP_SUCCESS } from "./_constants";

const signupByUsername = async (
  request: NextApiRequest,
  response: NextApiResponse<SuccessModel | ErrorModel>
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

    const validationResult: ValidationModel = signInValidation(
      username,
      password
    );

    if (!validationResult.success) {
      response.status(400).json({ errorKey: validationResult.errorKey });
      return;
    }

    const hashPassword: string = await bcrypt.hash(password, 10);

    const user: User = await prisma.user.create({
      data: { username: username, password: hashPassword },
    });

    if (!user) {
      response.status(404).json({ errorKey: "Sign up failed" });
    }

    response.status(200).json({ successKey: SIGN_UP_SUCCESS });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default signupByUsername;
