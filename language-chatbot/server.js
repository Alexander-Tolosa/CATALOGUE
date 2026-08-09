import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import { lookupWord, lookupGrammarPoint, checkConjugation } from "./lib/knowledgeBase.js";

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Check current available models/pricing at https://docs.claude.com before shipping.
const MODEL = "claude-sonnet-5";

const TOOLS = [
  {
    name: "lookup_word",
    description:
      "Look up a word's meaning, reading, part of speech, and proficiency level in the dictionary database. Always use this instead of recalling word meanings from memory — never state a definition, reading, or level from memory alone.",
    input_schema: {
      type: "object",
      properties: {
        word: { type: "string", description: "The exact word to look up, in its native script." },
        language: { type: "string", enum: ["en", "ja", "ko"] },
      },
      required: ["word", "language"],
    },
  },
  {
    name: "lookup_grammar_point",
    description:
      "Search the grammar rule database for a grammar pattern, structure, or rule. Always use this instead of explaining a grammar rule from memory.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords describing the grammar point, e.g. 'te iru' or 'honorific'." },
        language: { type: "string", enum: ["en", "ja", "ko"] },
      },
      required: ["query", "language"],
    },
  },
  {
    name: "check_conjugation",
    description:
      "Look up verified conjugation information for a verb. Always use this instead of guessing a conjugated form from memory.",
    input_schema: {
      type: "object",
      properties: {
        verb: { type: "string", description: "The dictionary/base form of the verb." },
        language: { type: "string", enum: ["ja", "ko"] },
        form: { type: "string", description: "The requested form, e.g. 'past', 'te-form', 'honorific'." },
      },
      required: ["verb", "language"],
    },
  },
];

function runTool(name, input) {
  switch (name) {
    case "lookup_word":
      return lookupWord(input.word, input.language);
    case "lookup_grammar_point":
      return lookupGrammarPoint(input.query, input.language);
    case "check_conjugation":
      return checkConjugation(input.verb, input.language, input.form);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

function buildSystemPrompt({ targetLanguage, userLevel }) {
  return `You are a language tutor helping a student learn ${targetLanguage}. The student's current level is ${userLevel}.

Rules you must follow:
1. For ANY grammar rule, word meaning, reading, or conjugation, you MUST use the provided tools (lookup_word, lookup_grammar_point, check_conjugation). Never state a grammar rule, word meaning, reading, or conjugated form from memory alone, even if you are confident.
2. If a tool returns found: false, or the result doesn't fully answer the question, say so explicitly to the student — do not fill the gap with a guess presented as fact. It is better to say "I don't have a verified entry for that" than to invent an answer.
3. Match your explanations to the student's level (${userLevel}). Do not introduce vocabulary or grammar well above that level without flagging it as advanced.
4. When correcting the student, cite the specific rule or word data returned by a tool, not just "this is wrong."
5. Stay focused on language learning, translation, and practice conversation. Politely redirect if asked about unrelated topics.
6. Idioms, regional dialects, and cultural nuance are easy to get subtly wrong — flag these explicitly as "this can vary by region/context" rather than stating them as fixed rules.`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, userLevel = "beginner", targetLanguage = "ja" } = req.body;
    let conversation = [...messages];
    const system = buildSystemPrompt({ targetLanguage, userLevel });

    // Tool-use loop: keep calling Claude until it stops requesting tools.
    for (let i = 0; i < 5; i++) {
      const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        system,
        tools: TOOLS,
        messages: conversation,
      });

      if (response.stop_reason !== "tool_use") {
        const textBlock = response.content.find((b) => b.type === "text");
        return res.json({ reply: textBlock?.text ?? "" });
      }

      // Model wants to call one or more tools — run them and feed results back.
      conversation.push({ role: "assistant", content: response.content });

      const toolResults = [];
      for (const block of response.content) {
        if (block.type === "tool_use") {
          const result = runTool(block.name, block.input);
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: JSON.stringify(result),
          });
        }
      }
      conversation.push({ role: "user", content: toolResults });
    }

    res.status(500).json({ error: "Too many tool-use iterations without a final answer." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating a response." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Language chatbot API running on port ${PORT}`));
