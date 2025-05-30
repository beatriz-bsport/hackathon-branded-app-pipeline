import DOMPurify from "dompurify";

type Props = {
  htmlContent: string;
};

export const HTMLPreview: React.FC<Props> = ({ htmlContent }: Props) => {
  if (!htmlContent) return null;
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
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }}
    />
  );
};
