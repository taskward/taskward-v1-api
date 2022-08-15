import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Authorization"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,HEAD"
  );
  response.headers.set("X-Powered-By", " 3.2.1");
  return response;
}
