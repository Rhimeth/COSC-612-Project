/*
Currently setup to work with OpenAI's API
*/

import OpenAI from "openai";
import dotenv from "dotenv";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: `${__dirname}/../../../.env` });


class LLM {
  // Attributes
  promptAndResponse = new Map();
  model = "gpt-3.5-turbo"; // Set the model
  temperature = 0; // deterministic
  max_tokens = 250;

  // Singleton pattern
  constructor() {
    console.log("LLM constructor called");
    if (!LLM.instance) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    } else {
      console.log("returning instance");
    }
  }

  getInstance() {
    if (!LLM.instance) {
      new LLM();
    }
    return LLM.instance;
  }

  // API Call
  async query(prompt) {
    try {
      console.log("Entering try block in LLM class of query()");
      const response = await this.__callLLM(prompt);
      this.promptAndResponse.set(prompt, response);
      console.log("Successfully finished try block");
      return response;
    } catch (error) {
      console.error("Query failed:", error);
      throw error;
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
      console.log("Entering try block in LLM class of __callLLM()");
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt.concat(
              " Always respond with 1 paragraph and then always end your reponse with at least 5 **real** recipes having to do with what the user describes to you. They may describe flavors, situations, moods, ect, and your angle is always supposed to be recipe and culinary focused. Remember to end your reponse with 5 **real** recipe titles. The recipes should have to do with what the user discussed."
            ),
          },
        ],
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.max_tokens,
        token_limit: this.token_limit,
      });

      console.log(completion.choices[0].message);
      return completion.choices[0].message;
    } catch (error) {
      console.error("Failed to get response from LLM: ", error);
      throw error;
    }
  }
}

export default LLM;
