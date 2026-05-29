import { Language } from '../types';

export type PopoverPosition = {
  x: number;
  y: number;
};

export type CreatePopoverParams = {
  charsCount: number;
  withParagraphs: boolean;
  language: Language;
  interfaceLanguage: Language;
  position: PopoverPosition;
};
