type EditableTextElement = HTMLInputElement | HTMLTextAreaElement;

type InsertValueAtCursorParams = {
  currentValue: string;
  cursorPosition: number;
  valueToInsert: string;
};

type InsertValueAtCursorResult = {
  value: string;
  cursorPosition: number;
};

export const getEditableTextElement = (
  elementId: string,
): EditableTextElement | null => {
  const element = document.getElementById(elementId);

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element;
  }

  return null;
};

export const insertValueAtCursor = ({
  currentValue,
  cursorPosition,
  valueToInsert,
}: InsertValueAtCursorParams): InsertValueAtCursorResult | null => {
  if (cursorPosition < 0 || cursorPosition > currentValue.length) {
    return null;
  }

  const value = [
    currentValue.slice(0, cursorPosition),
    valueToInsert,
    currentValue.slice(cursorPosition),
  ].join("");

  return {
    value,
    cursorPosition: cursorPosition + valueToInsert.length,
  };
};

export const focusEditableTextElementAtCursor = (
  element: EditableTextElement,
  cursorPosition: number,
) => {
  setTimeout(() => {
    element.focus();
    element.setSelectionRange(cursorPosition, cursorPosition);
  }, 0);
};
