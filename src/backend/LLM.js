/*
Currently setup to work with OpenAI's API
*/

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

let instance;

class LLM {
  // Attributes
  openai;
  promptAndResponse = new Map();
  model = "gpt-3.5-turbo"; // Set the model
  apiKey = process.env["OPEN_API_KEY"]; // Set API key
  temperature = 0; // deterministic


  // Singleton pattern
  constructor() {
    if (instance) {
      return instance; // Stops attempt from creating new instance
    }
    instance = this;

    const openai = new OpenAI({
      organization: "org-FzyqOvlHfNso0q3MLanLBMIC",
      project: "proj_bn69z1YXucu7oqp3bPmGglRz",
      apiKey: this.apiKey,
    });
  }

  getInstance(){
    if (instance) {
      return instance;
    }
    return new LLM();
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
  // TODO currently hardcoded to a test prompt
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
      const chatComplettion = await this.openai.chat.completions.create({
        messages: [{ role: "user", content: "Say this is a test" }],
        model: this.model,
        temperature: this.temperature,
      });

      return chatComplettion.data.choices[0].text.trim();
    } catch (error) {
      console.error("Failed to get response from LLM: ", error);
      throw error;
    }
  }
}

export default LLM;
