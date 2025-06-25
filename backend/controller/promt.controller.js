//controller/promt.controller.js
import OpenAI from "openai";
import { Prompt } from "../model/promt.model.js"


const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.OPENAI_API_KEY
});
console.log(openai.apiKey);

export const sendPromt = async(req, res) => {
    const { content } = req.body
    const userId = req.userId;
    if (!content || content.trim() === "") {
        return res.status(400).json({errors: "Promt content is required"})
    }
    try {

        //save to promt
        const userPromt = await Prompt.create({
            userId,
            role: "user",
            content
        }) 

        // send to openAI
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: content }],
            model: "deepseek-chat",
          });
        const aiContent = completion.choices[0].message.content
        
         //save assistant promt
        const aiMessage = await Prompt.create({
            userId,
            role: "assistant",
            content:aiContent
         }) 
        return res.status(200).json({reply:aiContent})
    } catch (error) {
        console.log("Error in Promt :", error) 
        return res.status(500).json({error:"Something went wrong with the AI response"})
    }
};