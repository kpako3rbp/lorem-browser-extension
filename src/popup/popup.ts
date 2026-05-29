import { TRANSLATIONS } from '../i18n';
import { Language } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { renderLanguageOptions } from './language-options';

const title = document.getElementById('popup-title');
const languageLabel = document.getElementById('interface-language-label');
const donateLink = document.getElementById('donate');
const languageSelect = document.getElementById('interface-language') as HTMLSelectElement | null;
const saveButton = document.getElementById('save') as HTMLButtonElement | null;

const renderTexts = (interfaceLanguage: Language): void => {
  const t = TRANSLATIONS[interfaceLanguage].popup;

  if (title) title.textContent = t.title;
  if (languageLabel) languageLabel.textContent = t.interfaceLanguage;
  if (saveButton) saveButton.textContent = t.save;
  if (donateLink) donateLink.textContent = `☕ ${t.donate}`;

  document.documentElement.lang = interfaceLanguage;
};

const renderLanguageSelect = (interfaceLanguage: Language): void => {
  if (!languageSelect) return;

  languageSelect.value = interfaceLanguage;
  languageSelect.innerHTML = renderLanguageOptions(interfaceLanguage);
};

const markSettingsChanged = (): void => {
  if (!languageSelect || !saveButton) return;

  renderTexts(languageSelect.value as Language);
  saveButton.disabled = false;
};

const closePopupSoon = (): void => {
  setTimeout(() => {
    window.close();
  }, 600);
};

const saveSettings = async (): Promise<void> => {
  if (!languageSelect || !saveButton) return;

  const interfaceLanguage = languageSelect.value as Language;

  await setStorageItem('interfaceLanguage', interfaceLanguage);
  await chrome.runtime.sendMessage({
    type: 'UPDATE_CONTEXT_MENU',
  });

  saveButton.textContent = `✅ ${TRANSLATIONS[interfaceLanguage].popup.saved}`;
  saveButton.disabled = true;

  closePopupSoon();
};

const initPopup = async (): Promise<void> => {
  if (saveButton) saveButton.disabled = true;

  const interfaceLanguage = await getStorageItem('interfaceLanguage');

  renderLanguageSelect(interfaceLanguage);
  renderTexts(interfaceLanguage);
};

void initPopup();

languageSelect?.addEventListener('change', markSettingsChanged);
saveButton?.addEventListener('click', () => {
  void saveSettings();
});
