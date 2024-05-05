/* eslint-disable no-undef */
/*
// Test ID: 01
*/
// This test sees if the LLM can detect correct inputs and that a response
// is recorded


import LLM from "../src/backend/LLM";

describe("LLM class", () => {
  let LLMinstance;

  // Instantiate LLM
  beforeAll(() => {
    LLMinstance = new LLM();
  });

  it("should be a singleton", () => {
    const instance1 = new LLM();
    const instance2 = new LLM();
    expect(instance1).toStrictEqual(instance2);
  });

  // Input Validation
  describe("callLLM method", () => {
    it("should throw an error if prompt is not a string", async () => {
      const prompt = 12345; // Not a string
      await expect(LLMinstance.query(prompt)).rejects.toThrow(
        "Prompt must be a string"
      );
    });

    it("should throw an error if prompt is empty sting", async () => {
      const prompt = ""; // Empty string
      await expect(LLMinstance.query(prompt)).rejects.toThrow(
        "Prompt cannot be empty"
      );
    });

    it("should throw an error if prompt is less than 11 characters", async () => {
      const prompt = "abc"; // Less than 11 characters
      await expect(LLMinstance.query(prompt)).rejects.toThrow(
        "Prompt must be more than 10 characters"
      );
    });

    it("should work if the string is over 11 characters", async () => {
      //const prompt = "This prompt is longer than ten characters";

      // should work


    });
  });
});
