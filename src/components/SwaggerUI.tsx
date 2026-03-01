"use client";

import SwaggerUIReact from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerUIProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spec: Record<string, any>;
}

export default function SwaggerUI({ spec }: SwaggerUIProps) {
  return (
    <SwaggerUIReact
      spec={spec}
      docExpansion="list"
      defaultModelsExpandDepth={-1}
      persistAuthorization={true}
    />
  );
}
