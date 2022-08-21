import type { NextApiRequest } from "next";
import { sign, verify, decode, JwtPayload } from "jsonwebtoken";

import { User } from "@prisma/client";

function createToken(user: User): string {
  const accessToken = sign(
    { username: user.username, id: user.id, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: "1h" }
  );
  return accessToken;
}

function validateToken(request: NextApiRequest): boolean {
  const accessToken = request.headers?.authorization?.split(" ")[1];
  if (!accessToken) {
    return false;
  }
  try {
    const validToken = verify(accessToken, process.env.JWT_KEY);
    if (!validToken) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

function decodeToken(request: NextApiRequest): string | JwtPayload | null {
  const accessToken = request.headers?.authorization?.split(" ")[1];
  if (!accessToken) {
    return null;
  }
  const decodeResult = decode(accessToken);
  return decodeResult;
}

export { createToken, validateToken, decodeToken };
