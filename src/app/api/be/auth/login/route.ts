import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { serverError } from "@/lib/api-helpers";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = loginSchema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) {
      return NextResponse.json({ message: "User not found or incorrect password" }, { status: 401 });
    }

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ message: "User not found or incorrect password" }, { status: 401 });
    }

    const token = jwt.sign({ sub: user.id }, process.env.AUTH_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (e) {
    return serverError(e);
  }
}
