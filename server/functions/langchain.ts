import { ChatVertexAI } from "@langchain/google-vertexai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";

const MODEL_NAME = "gemini-1.5-flash";

const model = new ChatVertexAI({
  model: MODEL_NAME,
  temperature: 0,
});

interface MessageInterpreterType {
  message: string;
}

async function messageInterpreter({ message }: MessageInterpreterType) {
  const messages = [
    new SystemMessage(
      "Act as a good assistant and provide the response for following query. Return message in form of string only don't use markdown. Can use emojis."
    ),
    new HumanMessage(message),
  ];
  const parser = new StringOutputParser();
  const result = await model.invoke(messages);
  const response = await parser.invoke(result);
  return response;
}

function isChatterbotString(str: string) {
  // Regular expression for case-insensitive matching
  const regex = /^chatterbot:/i;

  // Test if the string starts with "chatterbot:" (case-insensitive)
  return regex.test(str); // This already returns a boolean value (true/false)
}

function getTextAfterChatterbot(text: string) {
  // Lowercase the text for case-insensitive matching
  const lowerText = text.toLowerCase();

  // Find the index of "chatterbot:" (case-insensitive)
  const index = lowerText.indexOf("chatterbot:");

  // Check if "chatterbot:" is found
  if (index !== -1) {
    // Extract the text after "chatterbot:" (excluding the colon)
    return text.substring(index + "chatterbot:".length);
  } else {
    // "chatterbot:" not found, return empty string
    return "";
  }
}

export { messageInterpreter, isChatterbotString, getTextAfterChatterbot };
