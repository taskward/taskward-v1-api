import type { NextApiRequest } from "next";
import { sign, verify } from "jsonwebtoken";

import { AuthModel, JWTUserModel } from "@interfaces";

function createToken(user: JWTUserModel): string | null {
  if (!user.username || user.userId <= 0 || !user.role) {
    return null;
  }
  const accessToken = sign(
    { username: user.username, userId: user.userId, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
    // { expiresIn: "1s" }
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
