import { TRANSLATIONS } from '../i18n';
import { Language } from '../types';
import { MAX_CHARS, POPOVER_ID, POPOVER_OFFSET } from './constants';
import popoverStyles from './style.css?inline';
import { CreatePopoverParams } from './types';

const renderLanguageOptions = (selectedLanguage: Language): string => {
  return Object.values(Language)
    .map(
      (language) => `
        <option value="${language}" ${selectedLanguage === language ? 'selected' : ''}>
          ${language.toUpperCase()}
        </option>
      `,
    )
    .join('');
};

const createHost = (params: CreatePopoverParams): HTMLDivElement => {
  const host = document.createElement('div');

  host.id = POPOVER_ID;
  host.style.position = 'fixed';
  host.style.left = '0';
  host.style.top = '0';
  host.style.zIndex = '99999';
  host.dataset.cursorX = String(params.position.x);
  host.dataset.cursorY = String(params.position.y);

  return host;
};

const createStyle = (): HTMLStyleElement => {
  const style = document.createElement('style');

  style.textContent = popoverStyles;

  return style;
};

export const removePopover = (): void => {
  document.getElementById(POPOVER_ID)?.remove();
};

export const createPopover = (params: CreatePopoverParams): HTMLDivElement => {
  const { charsCount, withParagraphs, language, interfaceLanguage, position } = params;
  const t = TRANSLATIONS[interfaceLanguage].popover;
  const host = createHost(params);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const popover = document.createElement('div');

  popover.style.position = 'fixed';
  popover.style.left = `${position.x + POPOVER_OFFSET}px`;
  popover.style.top = `${position.y + POPOVER_OFFSET}px`;
  popover.className = 'lorem-popover';

  popover.innerHTML = `
    <p class="lorem-title">
      ${t.charsCount}
    </p>

    <input
      class="lorem-input"
      type="number"
      min="1"
      max="${MAX_CHARS}"
      value="${charsCount}"
    />

    <div class="lorem-options">
      <select class="lorem-language">
        ${renderLanguageOptions(language)}
      </select>

      <label class="lorem-checkbox">
        <input
          class="lorem-checkbox-input"
          type="checkbox"
          ${withParagraphs ? 'checked' : ''}
        />

        <span>
          ${t.paragraphs}
        </span>
      </label>
    </div>

    <div class="lorem-actions">
      <button
        type="button"
        class="lorem-insert"
      >
        ${t.insert}
      </button>

      <button
        type="button"
        class="lorem-cancel"
      >
        ${t.cancel}
      </button>
    </div>
  `;

  shadowRoot.append(createStyle(), popover);

  return host;
};
