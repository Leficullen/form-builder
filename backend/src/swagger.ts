export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Ristek Form Builder API",
    version: "1.0.0",
    description: "API documentation for the Ristek Form Builder backend",
  },
  servers: [
    {
      url: "/api/express",
      description: "Proxied API (Production/Native)",
    },
    {
      url: "http://localhost:4000",
      description: "Direct Backend (Local)",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Check API Health",
        tags: ["System"],
        security: [],
        responses: {
          200: {
            description: "API is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { ok: { type: "boolean" } },
                },
              },
            },
          },
        },
      },
    },
    "/user": {
      get: {
        summary: "Get current logged-in user",
        tags: ["User"],
        responses: {
          200: {
            description: "Success",
          },
          401: { description: "Unauthorized" },
          404: { description: "User not found" },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string", minLength: 6 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          409: { description: "Email already used" },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "User login",
        tags: ["Authentication"],
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string", minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful, returns token" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/forms": {
      get: {
        summary: "Get all forms owned by current user",
        tags: ["Forms"],
        responses: {
          200: { description: "List of forms" },
        },
      },
      post: {
        summary: "Create a new form",
        tags: ["Forms"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["DRAFT", "PUBLISHED"] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Form created successfully" },
        },
      },
    },
    "/forms/{id}": {
      get: {
        summary: "Get form by ID",
        tags: ["Forms"],
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Form found" },
          404: { description: "Form not found" },
        },
      },
      put: {
        summary: "Update form by ID",
        tags: ["Forms"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["DRAFT", "PUBLISHED"] },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: { type: "string" },
                        title: { type: "string" },
                        required: { type: "boolean" },
                        options: { type: "array", items: { type: "string" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Form updated" },
          400: { description: "Bad request" },
          403: { description: "Forbidden" },
          404: { description: "Form not found" },
        },
      },
      delete: {
        summary: "Delete form by ID",
        tags: ["Forms"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          204: { description: "Form deleted" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/forms/{id}/share/enable": {
      post: {
        summary: "Enable public sharing of a form",
        tags: ["Forms Share"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Sharing enabled" },
        },
      },
    },
    "/forms/{id}/share/disable": {
      post: {
        summary: "Disable public sharing of a form",
        tags: ["Forms Share"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Sharing disabled" },
        },
      },
    },
    "/forms/{id}/share/regenerate": {
      post: {
        summary: "Regenerate sharing link of a form",
        tags: ["Forms Share"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Sharing link regenerated" },
        },
      },
    },
    "/forms/{id}/submissions": {
      get: {
        summary: "Get all submissions for a form (Owner only)",
        tags: ["Forms Submissions"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "List of submissions" },
        },
      },
    },
    "/forms/{id}/submissions/{submissionId}": {
      get: {
        summary: "Get specific submission detail (Owner only)",
        tags: ["Forms Submissions"],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "submissionId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Submission details" },
        },
      },
    },
    "/public/forms/{shareId}": {
      get: {
        summary: "Get public form by Share ID",
        tags: ["Public Forms"],
        security: [],
        parameters: [
          {
            name: "shareId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Public form data" },
          404: { description: "Form not found or not published" },
        },
      },
    },
    "/public/forms/{shareId}/submissions": {
      post: {
        summary: "Submit answers to a public form",
        tags: ["Public Forms"],
        security: [],
        parameters: [
          {
            name: "shareId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  answers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        questionId: { type: "string" },
                        value: {},
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Submission successful" },
          400: { description: "Validation failed" },
        },
      },
    },
  },
};
