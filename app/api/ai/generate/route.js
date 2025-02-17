import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { title, section } = await req.json();

    if (!title || !section) {
      return NextResponse.json(
        { error: 'Title and section are required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    let prompt;
    switch (section) {
      case 'intro':
        prompt = `Write a compelling introduction paragraph for a blog post titled "${title}". 
        The introduction should hook the reader and provide a brief overview of what the post will cover.`;
        break;
      case 'description':
        prompt = `Write a detailed, multi-paragraph description for a blog post titled "${title}". 
        Include relevant information, examples, and insights. Make it informative and engaging.`;
        break;
      case 'conclusion':
        prompt = `Write a strong concluding paragraph for a blog post titled "${title}". 
        Summarize the key points and end with a thought-provoking statement or call to action.`;
        break;
      default:
        throw new Error('Invalid section specified');
    }

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ content: text });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
} 