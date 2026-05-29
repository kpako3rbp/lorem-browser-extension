import { NAME_BY_LANGUAGE } from '../constants';
import { Language } from '../types';

export const renderLanguageOptions = (selectedLanguage: Language): string => {
  return Object.values(Language)
    .map(
      (language) => `
        <option value="${language}" ${selectedLanguage === language ? 'selected' : ''}>
          ${NAME_BY_LANGUAGE[language]}
        </option>
      `,
    )
    .join('');
};
