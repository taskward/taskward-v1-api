import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  return response;
}
