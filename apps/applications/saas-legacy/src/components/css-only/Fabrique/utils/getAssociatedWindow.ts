import getAssociatedDocument from './getAssociatedDocument';

export default function getAssociatedWindow(node: Node | undefined): Window {
  const doc = getAssociatedDocument(node);
  return doc.defaultView || window;
}
