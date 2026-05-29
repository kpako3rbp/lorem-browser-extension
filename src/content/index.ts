import { ExtensionMessage } from '../types';
import { createEmptyTargetSnapshot, getEditableTargetSnapshot } from './editable-target';
import { showPopover } from './popover-controller';
import { EditableTargetSnapshot } from './types';

declare global {
  interface Window {
    __loremExtensionLoaded?: boolean;
  }
}

const bootstrapContentScript = (): void => {
  if (window.__loremExtensionLoaded) return;

  window.__loremExtensionLoaded = true;

  let latestTarget: EditableTargetSnapshot = createEmptyTargetSnapshot();

  document.addEventListener(
    'contextmenu',
    (event) => {
      latestTarget = getEditableTargetSnapshot(event);
    },
    true,
  );

  chrome.runtime.onMessage.addListener((message: ExtensionMessage) => {
    if (message.type !== 'INSERT_LOREM') return;

    void showPopover(latestTarget);
  });
};

bootstrapContentScript();
