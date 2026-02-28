// Routes are handled by the App Router at src/app/api/express/
// This file satisfies the Next.js Pages Router constraints.
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ message: "Not found" });
}
