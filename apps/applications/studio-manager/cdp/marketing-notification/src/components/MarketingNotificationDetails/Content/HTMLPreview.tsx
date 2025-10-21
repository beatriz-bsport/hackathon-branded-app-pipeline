import DOMPurify from "dompurify";

import { Body, Card } from "@bsport/kaizen-primitive-core";

type Props = {
  htmlContent: string;
  resolvedGenericTags?: Record<string, string>;
  noContentMessage?: string;
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
  noContentMessage,
}: Props) => {
  const processedContent = resolvedGenericTags
    ? replaceGenericTagsInTemplate(resolvedGenericTags, htmlContent)
    : htmlContent;

  if (!processedContent) {
    return (
      <Card className="flex flex-col min-h-[180px] bg-surface-default-weaker border-none justify-center">
        <Body
          className="my-auto text-center"
          htmlVariant="p"
          weight="weak"
          color="weak"
          size="md"
        >
          {noContentMessage || ""}
        </Body>
      </Card>
    );
  }

  return (
    <div
      className="p-4 rounded-md bg-white max-h-[80vh] overflow-auto scrollbar-thin"
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
