import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth";
import formRoutes from "./routes/form";

import path from "path";

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/", (_req, res) => {
  res.json({ message: "Ristek Form Builder API is running!" });
});
app.use("/auth", authRoutes);
app.use("/forms", formRoutes);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: "error: " , err });
});
