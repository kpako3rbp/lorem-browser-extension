import { SENTENCE_TEMPLATES_BY_LANGUAGE, TEXT_PARTS_BY_LANGUAGE } from '../constants';
import { Language, TextParts } from '../types';
import { getRandomItem } from './random';

type LoremOptions = {
  length: number;
  withParagraphs: boolean;
  language: Language;
};

const MIN_SENTENCES_IN_PARAGRAPH = 2;
const PARAGRAPH_SIZE_VARIANTS = 3;

const capitalize = (text: string): string => {
  if (!text.length) return text;

  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getRandomParagraphSize = (): number => {
  return Math.floor(Math.random() * PARAGRAPH_SIZE_VARIANTS) + MIN_SENTENCES_IN_PARAGRAPH;
};

const replaceTemplateVariables = (template: string, parts: TextParts): string => {
  return template
    .replace('{start}', getRandomItem(parts.starts))
    .replace('{subject}', getRandomItem(parts.subjects))
    .replace('{predicate}', getRandomItem(parts.predicates))
    .replace('{object}', getRandomItem(parts.objects))
    .replace('{ending}', getRandomItem(parts.endings));
};

const generateSentence = (parts: TextParts, language: Language): string => {
  const template = getRandomItem(SENTENCE_TEMPLATES_BY_LANGUAGE[language]);
  const sentence = replaceTemplateVariables(template, parts).trim();

  return capitalize(sentence);
};

const appendChunk = (chunks: string[], chunk: string): number => {
  chunks.push(chunk);

  return chunk.length;
};

export const generateLorem = (options: LoremOptions): string => {
  const { length, withParagraphs, language } = options;
  const textParts = TEXT_PARTS_BY_LANGUAGE[language];
  const chunks: string[] = [];

  let currentLength = 0;
  let sentencesInParagraph = 0;
  let targetParagraphSize = getRandomParagraphSize();

  while (currentLength < length) {
    const sentence = generateSentence(textParts, language);

    currentLength += appendChunk(chunks, sentence);
    sentencesInParagraph += 1;

    const shouldStartNewParagraph =
      withParagraphs && sentencesInParagraph >= targetParagraphSize && currentLength < length;

    if (shouldStartNewParagraph) {
      currentLength += appendChunk(chunks, '\n\n');
      sentencesInParagraph = 0;
      targetParagraphSize = getRandomParagraphSize();
    } else {
      currentLength += appendChunk(chunks, ' ');
    }
  }

  return chunks.join('').slice(0, length);
};
