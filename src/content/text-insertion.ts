import { isTextInputElement } from './editable-target';
import { EditableTarget } from './types';

const dispatchTextInputEvent = (element: HTMLElement, text: string): void => {
  element.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText',
      data: text,
    }),
  );
};

const insertIntoTextInput = (element: HTMLInputElement | HTMLTextAreaElement, text: string): void => {
  element.focus();

  const start = element.selectionStart ?? element.value.length;
  const end = element.selectionEnd ?? element.value.length;
  const nativeValueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
  const nextValue = element.value.slice(0, start) + text + element.value.slice(end);

  nativeValueSetter?.call(element, nextValue);

  const cursorPosition = start + text.length;

  element.setSelectionRange(cursorPosition, cursorPosition);
  dispatchTextInputEvent(element, text);
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const restoreContentEditableSelection = (savedRange: Range | null): void => {
  if (!savedRange) return;

  const selection = window.getSelection();

  if (!selection) return;

  selection.removeAllRanges();
  selection.addRange(savedRange);
};

const insertIntoContentEditable = (element: HTMLElement, text: string, savedRange: Range | null): void => {
  element.focus();
  restoreContentEditableSelection(savedRange);

  document.execCommand('insertText', false, text);
  dispatchTextInputEvent(element, text);
};

export const insertTextAtTarget = (element: EditableTarget | null, text: string, savedRange: Range | null): void => {
  if (!element) return;

  if (isTextInputElement(element)) {
    insertIntoTextInput(element, text);

    return;
  }

  if (element.isContentEditable) {
    insertIntoContentEditable(element, text, savedRange);
  }
};
