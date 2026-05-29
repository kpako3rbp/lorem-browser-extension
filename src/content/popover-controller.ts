import { createPopover, movePopoverInsideViewport, removePopover } from '../popover';
import { POPOVER_ID } from '../popover/constants';
import { Language } from '../types';
import { generateLorem } from '../utils/lorem';
import { queryElement } from '../utils/query-element';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { insertTextAtTarget } from './text-insertion';
import { EditableTargetSnapshot } from './types';

type PopoverElements = {
  input: HTMLInputElement;
  insertButton: HTMLButtonElement;
  cancelButton: HTMLButtonElement;
  checkbox: HTMLInputElement;
  languageSelect: HTMLSelectElement;
};

const getPopoverElements = (shadowRoot: ShadowRoot): PopoverElements => ({
  input: queryElement<HTMLInputElement>(shadowRoot, '.lorem-input'),
  insertButton: queryElement<HTMLButtonElement>(shadowRoot, '.lorem-insert'),
  cancelButton: queryElement<HTMLButtonElement>(shadowRoot, '.lorem-cancel'),
  checkbox: queryElement<HTMLInputElement>(shadowRoot, '.lorem-checkbox-input'),
  languageSelect: queryElement<HTMLSelectElement>(shadowRoot, '.lorem-language'),
});

const closeActivePopover = (): void => {
  removePopover();
  document.removeEventListener('mousedown', closePopoverOnOutsideClick, true);
};

function closePopoverOnOutsideClick(event: MouseEvent): void {
  const host = document.getElementById(POPOVER_ID);

  if (!host) return;

  const target = event.target;

  if (!(target instanceof Node)) return;
  if (host.contains(target)) return;

  closeActivePopover();
}

const saveGenerationSettings = async (
  charsCount: number,
  withParagraphs: boolean,
  language: Language,
): Promise<void> => {
  await Promise.all([
    setStorageItem('withParagraphs', withParagraphs),
    setStorageItem('charsCount', charsCount),
    setStorageItem('language', language),
  ]);
};

const getCharsCount = (input: HTMLInputElement): number | null => {
  const chars = Number(input.value);

  if (!Number.isFinite(chars) || chars <= 0) {
    input.focus();
    input.select();

    return null;
  }

  return Math.floor(chars);
};

const submitText = async (elements: PopoverElements, target: EditableTargetSnapshot): Promise<void> => {
  const charsCount = getCharsCount(elements.input);

  if (!charsCount) return;

  const withParagraphs = elements.checkbox.checked;
  const language = elements.languageSelect.value as Language;

  await saveGenerationSettings(charsCount, withParagraphs, language);

  const text = generateLorem({ length: charsCount, language, withParagraphs });

  insertTextAtTarget(target.element, text, target.savedRange);
  closeActivePopover();
};

const bindPopoverEvents = (elements: PopoverElements, target: EditableTargetSnapshot): void => {
  elements.insertButton.addEventListener('click', () => {
    void submitText(elements, target);
  });

  elements.cancelButton.addEventListener('click', closeActivePopover);
  document.addEventListener('mousedown', closePopoverOnOutsideClick, true);

  elements.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      void submitText(elements, target);
    }

    if (event.key === 'Escape') {
      closeActivePopover();
    }
  });
};

export const showPopover = async (target: EditableTargetSnapshot): Promise<void> => {
  closeActivePopover();

  const [charsCount, withParagraphs, language, interfaceLanguage] = await Promise.all([
    getStorageItem('charsCount'),
    getStorageItem('withParagraphs'),
    getStorageItem('language'),
    getStorageItem('interfaceLanguage'),
  ]);

  const popover = createPopover({
    charsCount,
    withParagraphs,
    language,
    interfaceLanguage,
    position: target.position,
  });

  const shadowRoot = popover.shadowRoot;

  if (!shadowRoot) {
    throw new Error('Shadow root not found');
  }

  document.body.appendChild(popover);

  requestAnimationFrame(() => {
    movePopoverInsideViewport(popover);
  });

  const elements = getPopoverElements(shadowRoot);

  bindPopoverEvents(elements, target);

  requestAnimationFrame(() => {
    elements.input.focus();
    elements.input.select();
  });
};
