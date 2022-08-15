import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  request.headers.append("Access-Control-Allow-Origin", "*");
  request.headers.append(
    "Access-Control-Allow-Headers",
    "X-Requested-With,Authorization"
  );
  request.headers.append(
    "Access-Control-Allow-Methods",
    "PUT,POST,GET,DELETE,OPTIONS,HEAD"
  );
  request.headers.append("X-Powered-By", " 3.2.1");
  return NextResponse.next();
}

export const config = {
  matcher: "*",
};
