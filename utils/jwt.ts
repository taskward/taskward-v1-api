import type { NextApiRequest } from "next";
import { sign, verify, decode } from "jsonwebtoken";

import { User } from "@prisma/client";

function createToken(user: User): string {
  const accessToken = sign(
    { username: user.username, id: user.id, role: user.role },
    process.env.JWT_KEY,
    { expiresIn: "1d" }
  );
  return accessToken;
}

function validateToken(request: NextApiRequest): boolean {
  const accessToken = request.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return false;
  }
  const validToken = verify(accessToken, process.env.JWT_KEY);
  if (!validToken) {
    return false;
  }
  return true;
}

function decodeToken(request: NextApiRequest) {
  const accessToken = request.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return false;
  }
  const result = decode(accessToken);
}

export { createToken, validateToken };
