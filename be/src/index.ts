require("dotenv").config();
import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import cors from 'cors';
import express from 'express';
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";

const anthropic = new Anthropic();
const app = express();
app.use(cors())
app.use(express.json())

// Add this type for error responses
interface ErrorResponse {
  success: false;
  details: string;
}

app.post("/template", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        
        const response = await anthropic.messages.create({
            messages: [{
                role: 'user', content: prompt
            }],
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 200,
            system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
        });

        const answer = (response.content[0] as TextBlock).text; // react or node
        if (answer == "react") {
            res.json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(403).json({
            success: false,
            details: "Invalid template type"
        });
        
    } catch (error) {
        let errorMessage: string;
        
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = 'An unknown error occurred';
        }

        console.error('Template error:', error);
        res.status(500).json({
            success: false,
            details: errorMessage
        });
    }
});

app.post("/chat", async (req, res) => {
    try {
        const messages = req.body.messages;
        const response = await anthropic.messages.create({
            messages: messages,
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 8000,
            system: getSystemPrompt()
        });

        res.json({
            response: (response.content[0] as TextBlock)?.text
        });
    } catch (error) {
        let errorMessage: string;
        
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else {
            errorMessage = 'An unknown error occurred';
        }

        res.status(500).json({
            success: false,
            details: errorMessage
        });
    }
})

app.listen(3000);