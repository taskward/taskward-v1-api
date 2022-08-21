import type { NextApiRequest } from "next";
import { sign, verify } from "jsonwebtoken";

import { User, Role } from "@prisma/client";
import { AuthModel } from "@interfaces";

function createToken(user: User): string {
  const accessToken = sign(
    { username: user.username, userId: user.id, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );
  return accessToken;
}

function validateToken(request: NextApiRequest): AuthModel | undefined {
  const accessToken = request.headers?.authorization?.split(" ")[1];
  if (!accessToken) {
    return undefined;
  }
  let verifyResult: AuthModel | undefined;
  verify(accessToken, process.env.JWT_KEY, function (err, decoded) {
    if (err !== null) {
      verifyResult = undefined;
    } else {
      if (decoded) {
        verifyResult = decoded as AuthModel;
      } else {
        verifyResult = undefined;
      }
    }
  });
  return verifyResult;
}

export { createToken, validateToken };
