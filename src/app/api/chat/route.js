import { auth } from "@clerk/nextjs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req){
    try{
        const {userId} = auth();
        const body = await req.json();
        const {messages} = body;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!genAI){
            return new NextResponse("Api key not configured", { status: 500 });
        }

        if(!messages){
            return new NextResponse("Messages are required ", { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = messages
        const result = await model.generateContent(prompt[messages.length - 1].content);
        const response = await result.response;
        const text = response.text();
        
        const output = {role: 'model', content: text}

        return new NextResponse(text);
        
        
    }catch(error){
        console.log("[CHAT_ERROR]", error);
        return new NextResponse("Internal error", { status: 500})
    }
}