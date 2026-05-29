import { CursorPosition, EditableTargetSnapshot, TextInputElement } from './types';

const DEFAULT_POSITION: CursorPosition = { x: 0, y: 0 };

export const isTextInputElement = (element: Element): element is TextInputElement => {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
};

const cloneCurrentSelectionRange = (): Range | null => {
  const selection = window.getSelection();

  return selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null;
};

export const getEditableTargetSnapshot = (event: MouseEvent): EditableTargetSnapshot => {
  const position = {
    x: event.clientX,
    y: event.clientY,
  };

  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return {
      element: null,
      position,
      savedRange: null,
    };
  }

  if (isTextInputElement(target)) {
    return {
      element: target,
      position,
      savedRange: null,
    };
  }

  const editableElement = target.closest<HTMLElement>('[contenteditable="true"]');

  return {
    element: editableElement,
    position,
    savedRange: editableElement ? cloneCurrentSelectionRange() : null,
  };
};

export const createEmptyTargetSnapshot = (): EditableTargetSnapshot => ({
  element: null,
  position: DEFAULT_POSITION,
  savedRange: null,
});
