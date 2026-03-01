import type { Metadata } from "next";
import { swaggerDocument } from "@/lib/swagger";
import SwaggerUI from "@/components/SwaggerUI";

export const metadata: Metadata = {
  title: "API Documentation | Ristek Form Builder",
  description:
    "Interactive API documentation for the Ristek Form Builder REST API.",
};

export default function ApiDocsPage() {
  return (
    <main className="mt-30">
      <SwaggerUI spec={swaggerDocument} />
    </main>
  );
}
