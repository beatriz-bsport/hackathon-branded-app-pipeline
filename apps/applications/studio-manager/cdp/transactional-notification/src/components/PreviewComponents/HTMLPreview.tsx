import DOMPurify from "dompurify";

type Props = {
  htmlContent: string;
  resolvedGenericTags?: Record<string, string>;
};

export const replaceGenericTagsInTemplate = (
  resolvedGenericTags: Record<string, string>,
  contentTemplate: string,
) => {
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const newContentTemplate = Object.entries(resolvedGenericTags || {}).reduce(
    (acc, [tagName, tagValue]) => {
      // Replace all literal occurrences of the placeholder with the value
      return acc.replace(new RegExp(escapeRegExp(tagName), "g"), tagValue);
    },
    contentTemplate || "",
  );

  return newContentTemplate;
};

export const HTMLPreview: React.FC<Props> = ({
  htmlContent,
  resolvedGenericTags,
}: Props) => {
  if (!htmlContent) return null;
  const processedContent = resolvedGenericTags
    ? replaceGenericTagsInTemplate(resolvedGenericTags, htmlContent)
    : htmlContent;
  return (
    <div
      className="p-4 bg-white max-h-[80vh] overflow-auto scrollbar-thin"
      /**
       * We need to use `dangerouslySetInnerHTML` to render HTML content easily.
       * But as this can lead to XSS attacks, we need to sanitize the HTML content
       * before rendering it. We use DOMPurify for this purpose.
       *
       * Waiting for the creation of a business component to handle html preview
       */
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processedContent) }}
    />
  );
};
