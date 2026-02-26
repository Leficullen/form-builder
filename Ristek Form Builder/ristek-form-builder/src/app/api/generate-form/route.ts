import { NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            title: {
              type: SchemaType.STRING,
              description: "The title of the generated form.",
            },
            description: {
              type: SchemaType.STRING,
              description: "A short description of the form.",
            },
            questions: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  title: {
                    type: SchemaType.STRING,
                    description: "The question text.",
                  },
                  type: {
                    type: SchemaType.STRING,
                    description: "MUST strictly be one of the specified types.",
                    format: "enum",
                    enum: [
                      "SHORT_ANSWER",
                      "PARAGRAPH",
                      "MULTIPLE_CHOICE",
                      "CHECKBOXES",
                      "DROPDOWN",
                    ],
                  },
                  required: {
                    type: SchemaType.BOOLEAN,
                    description: "Whether the question is mandatory.",
                  },
                  options: {
                    type: SchemaType.ARRAY,
                    items: {
                      type: SchemaType.STRING,
                    },
                    description:
                      "Provide options ONLY if the type is MULTIPLE_CHOICE, CHECKBOXES, or DROPDOWN. Otherwise, an empty array.",
                  },
                },
                required: ["title", "type", "required", "options"],
              },
            },
          },
          required: ["title", "description", "questions"],
        },
      },
      systemInstruction:
        "You are an expert form designer. Based on the user's prompt, generate a structured form. Output strictly in Indonesian language.",
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const parsedData = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Failed to generate form with AI:", error);
    return NextResponse.json(
      {
        message: "Failed to generate form",
        error: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
