/*
Currently setup to work with OpenAI's API
*/

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

let instance;

export class LLM {
  // Attributes
  promptAndResponse = new Map();
  openai;
  model = "gpt-3.5-turbo"; // Set the model
  apiKey = ""; // Set key

  // Singleton pattern
  constructor() {
    if (instance) {
      return instance; // Returns existin instance
    }
    instance = this;

    const openAIClient = new OpenAI({
      apikey: process.env["OPENAI_API_KEY"],
    });
  }

  // API Call
  async query(prompt) {
    try {
      const response = await this.__callLLM(prompt);
      this.promptAndResponse.set(prompt, response);
    } catch (error) {
      console.error("Query method failed", error);
      throw error;
    }
  }

  // Called inside query()
  async __callLLM(prompt) {
    if (typeof prompt !== "string") {
      throw new Error("Prompt must be a string");
    }
    if (prompt.length === 0) {
      throw new Error("Prompt cannot be empty");
    }
    if (!prompt) {
      throw new Error("Invalid prompt");
    }
    if (prompt.length < 11) {
      throw new Error("Prompt must be more than 10 characters");
    }
    try {
      const response = await this.openAIClient.chat.completions.create({
        model: model, // model name
        messages: [
          {
            role: "system",
            content:
              "You are a culinary expert but you express it overtly because you are a chatbot of few words. When users ask you about anything other than food, recipes, cooking, ingredients, or descriptions of recipes, you should not respond. You should respond with only one good sentence, followed by 5 possible food titles that either 1) have the ingredients they are interested in used in the food, or 2) may be a food or recipe the user is describing but doesn't know the name of. For example the user may say 'I was at a BBQ and there was this food on a stick, some were peppers, but had other vegetables that idk what they were', you may give you best 5 guess for what it could have been.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error("No response from LLM API", error);
      throw error;
    }
  }
}

export default LLM;
