/*
// Test ID: 01
*/
// This test sees if the LLM can detect correct inputs and that a response
// is recorded


import LLM from "../backend/LLM";

describe("LLM class", () => {
  let LLMisntance;

  // Instantiate LLM
  beforeAll(() => {
    LLMisntance = new LLM();
  });

  it("should be a singleton", () => {
    const instance1 = new LLM();
    const instance2 = new LLM();
    expect(instance1).toBe(instance2);
  });

  // Input Validation
  describe("callLLM method", () => {
    it("should throw an error if prompt is not a string", async () => {
      const prompt = 12345; // Not a string
      await expect(LLMisntance.query(prompt)).rejects.toThrow(
        "Prompt must be a string"
      );
    });

    it("should throw an error if prompt is empty sting", async () => {
      const prompt = ""; // Empty string
      await expect(LLMisntance.query(prompt)).rejects.toThrow(
        "Prompt cannot be empty"
      );
    });

    it("should throw an error if prompt is less than 11 characters", async () => {
      const prompt = "abc"; // Less than 11 characters
      await expect(LLMisntance.query(prompt)).rejects.toThrow(
        "Prompt must be more than 10 characters"
      );
    });

    it("should work if the string is over 11 characters", async () => {
      const prompt = "This prompt is longer than ten characters";

      // should work


    });
  });
});
