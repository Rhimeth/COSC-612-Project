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
  model = "gpt-3.5-turbo"; // Set the model
  apiKey = ""; // Set key

  // Singleton pattern
  constructor() {
    if (instance) {
      return instance; // Returns existin instance
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
      console.error("Query method failed", error);
      return null;
    }
  }




  // Called inside query()
  async __callLLM(prompt) {
    if (typeof prompt !== "string") {
      throw new Error("Prompt must be a string");
    }
    if (!prompt) {
      throw new Error("Invalid prompt");
    }
    if (prompt.length === 0) {
      throw new Error("Prompt cannot be empty");
    }
    if (prompt.length < 11) {
      throw new Error("Prompt must be more than 10 characters");
    }
    try {
      const response = await this.openai.createCompletion({
        model: model, // model name
        prompt: String.concat(prompt, "Only answer in two sentences."),
        max_tokens: 150,
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      console.error("No response from LLM API", error);
      throw error;
    }
  }


}
