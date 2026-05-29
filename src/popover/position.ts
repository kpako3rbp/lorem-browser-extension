import { POPOVER_OFFSET } from './constants';

const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(value, max));
};

export const movePopoverInsideViewport = (host: HTMLElement): void => {
  const popover = host.shadowRoot?.querySelector<HTMLElement>('.lorem-popover');

  if (!popover) return;

  const rect = popover.getBoundingClientRect();
  const cursorX = Number(host.dataset.cursorX);
  const cursorY = Number(host.dataset.cursorY);

  const hasSpaceBottom = cursorY + rect.height + POPOVER_OFFSET <= window.innerHeight;
  const hasSpaceTop = cursorY - rect.height - POPOVER_OFFSET >= 0;
  const hasSpaceRight = cursorX + rect.width + POPOVER_OFFSET <= window.innerWidth;
  const hasSpaceLeft = cursorX - rect.width - POPOVER_OFFSET >= 0;

  const verticalPosition =
    !hasSpaceBottom && hasSpaceTop ? cursorY - rect.height - POPOVER_OFFSET : cursorY + POPOVER_OFFSET;
  const horizontalPosition =
    !hasSpaceRight && hasSpaceLeft ? cursorX - rect.width - POPOVER_OFFSET : cursorX + POPOVER_OFFSET;

  popover.style.top = `${clamp(verticalPosition, POPOVER_OFFSET, window.innerHeight - rect.height - POPOVER_OFFSET)}px`;
  popover.style.left = `${clamp(horizontalPosition, POPOVER_OFFSET, window.innerWidth - rect.width - POPOVER_OFFSET)}px`;
};
