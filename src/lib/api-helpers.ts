import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function getAuthUserId(req: NextRequest): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET!) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ message }, { status: 404 });
}

export function badRequest(message = "Bad request") {
  return NextResponse.json({ message }, { status: 400 });
}

export function serverError(e: unknown) {
  console.error(e);
  return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
