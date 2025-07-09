import dotenv from "dotenv";
dotenv.config(); 
import OpenAI from "openai";
import { Prompt } from "../model/promt.model.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Don't set baseURL when using OpenAI's official API
});

console.log("OpenAI Key:", openai.apiKey);

export const sendPromt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim() === "") {
    return res.status(400).json({ errors: "Prompt content is required" });
  }

  try {
    // Save user's prompt
    await Prompt.create({
      userId,
      role: "user",
      content,
    });

    // Send to OpenAI
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content }],
      model: "gpt-3.5-turbo", // ✅ Correct model name
    });

    const aiContent = completion.choices[0]?.message?.content || "⚠️ No reply from AI.";

    // Save assistant's response
    await Prompt.create({
      userId,
      role: "assistant",
      content: aiContent,
    });

    return res.status(200).json({ reply: aiContent });

  } catch (error) {
    console.error("Error in Prompt:", error.message || error);
    return res.status(500).json({ error: "Something went wrong with the AI response" });
  }
};
