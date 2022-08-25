import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

import { prisma } from "@database";

import { errorHandler, createToken } from "@utils";
import {
  ErrorModel,
  SuccessModel,
  ValidationModel,
  UserInfoModel,
  JWTUserModel,
} from "@interfaces";
import { ERROR_405_MESSAGE } from "@constants";

import { signInValidation } from "./_services";
import { SIGNUP_FAILED, SIGNUP_SUCCESS } from "./_constants";
import { SignupResult } from "./_interfaces";

const signupByUsername = async (
  request: NextApiRequest,
  response: NextApiResponse<(SignupResult & SuccessModel) | ErrorModel>
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

    const { username, password, confirmPassword } = request.body;

    const validationResult: ValidationModel = signInValidation(
      username,
      password
    );

    if (!validationResult.success) {
      response.status(400).json({ errorKey: validationResult.errorKey });
      return;
    }

    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: { username: username, password: hashedPassword },
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
      response.status(404).json({ errorKey: SIGNUP_FAILED });
      return;
    }

    // Generate JWT Token
    const jwtUserModel: JWTUserModel = {
      username: user.username,
      userId: user.id,
      role: user.role,
    };
    const generatedToken = createToken(jwtUserModel);
    if (!generatedToken) {
      response.status(401).json({ errorKey: SIGNUP_FAILED });
      return;
    }

    response.status(200).json({
      successKey: SIGNUP_SUCCESS,
      accessToken: generatedToken as string,
      user: user,
    });
  } catch (error) {
    response.status(500).end(errorHandler(error));
  }
};

export default signupByUsername;
