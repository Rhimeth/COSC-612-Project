/*
Currently setup to work with OpenAI's API
*/

import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

dotenv.config();

let instance;

export class LLM {
  // Attributes
  promptAndResponse = new Map();
  openai;
  model = ""; // Set the model
  apiKey = ""; // Set API key

  // Singleton pattern
  constructor() {
    if (instance) {
      return instance; // Stops attempt from creating new instance
    }
    instance = this;

    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  // API Call
  async query(prompt) {
    try {
      const response = await this.__callLLM(prompt);
      this.promptAndResponse.set(prompt, response);
    } catch (error) {
      console.error("Query failed:", error);
      return null;
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
    if (prompt.length < 11) {
      throw new Error("Prompt must be more than 10 characters");
    }
    try {
      const response = await this.openai.createCompletion({
        model: model, // model nam
        prompt: prompt,
        max_tokens: 150,
      });
      return response.data.choices[0].text.trim();
      
    } catch (error) {
      console.error("Failed to get response from LLM:", error);
      throw error;
    }
  }
}
