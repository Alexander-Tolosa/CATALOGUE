import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dictionary = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/dictionary.json"), "utf-8"));
const grammar = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/grammar.json"), "utf-8"));

/**
 * Looks up a word in the dictionary. In production, replace this with:
 * - JMdict (Japanese) via a local import or API
 * - A Korean dictionary API (e.g. National Institute of Korean Language's Urimalsaem API)
 * - Oxford/WordNet API or a licensed English dictionary for English
 */
export function lookupWord(word, language) {
  const normalized = word.trim();
  const match = dictionary.find(
    (entry) => entry.language === language && entry.word === normalized
  );
  if (!match) {
    return { found: false, message: `No dictionary entry found for "${word}" in ${language}.` };
  }
  return { found: true, ...match };
}

/**
 * Searches grammar rules by keyword. In production, back this with a real
 * grammar rule database (structured by JLPT/TOPIK/CEFR level) or a vetted
 * grammar reference API instead of a static JSON file.
 */
export function lookupGrammarPoint(query, language) {
  const q = query.toLowerCase();
  const matches = grammar.filter(
    (entry) =>
      entry.language === language &&
      (entry.pattern.toLowerCase().includes(q) ||
        entry.keywords.some((k) => k.toLowerCase().includes(q) || q.includes(k.toLowerCase())))
  );
  if (matches.length === 0) {
    return { found: false, message: `No grammar entry found matching "${query}" in ${language}.` };
  }
  return { found: true, results: matches };
}

/**
 * Placeholder conjugation checker. This is illustrative only — for real
 * Japanese/Korean conjugation, use a proper morphological analyzer
 * (e.g. Kuromoji/MeCab for Japanese, MeCab-ko or KoNLPy for Korean)
 * rather than hand-written rules, which break on irregular verbs.
 */
export function checkConjugation(verb, language, form) {
  const entry = dictionary.find((e) => e.language === language && e.word === verb);
  if (!entry) {
    return { found: false, message: `"${verb}" not found in the verb database for ${language}.` };
  }
  return {
    found: true,
    word: entry.word,
    reading: entry.reading,
    pos: entry.pos,
    note: "Full conjugation tables are not implemented in this prototype — wire in a morphological analyzer for production use.",
    requested_form: form || "dictionary form",
  };
}
