import { sign, verify } from "jsonwebtoken";

import { User } from "@prisma/client";

function createToken(user: User): string {
  const accessToken = sign(
    { username: user.username, id: user.id },
    process.env.JWT_KEY
  );
  return accessToken;
}

export { createToken };
