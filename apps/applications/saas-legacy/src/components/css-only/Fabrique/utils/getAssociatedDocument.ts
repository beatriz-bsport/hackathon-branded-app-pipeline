/**
 * Utility function used to retrieve the Document object associated with a given DOM node.
 *
 * @export
 * @param {(Node | null | undefined)} node
 * @return {*}  {Document}
 */
export default function getAssociatedDocument(
  node: Node | null | undefined,
): Document {
  return (node && node.ownerDocument) || document;
}
