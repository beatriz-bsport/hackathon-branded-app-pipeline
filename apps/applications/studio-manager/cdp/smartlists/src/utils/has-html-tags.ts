const HTML_TAG_REGEX = /<[^>]+>/;

export const hasHtmlTags = (content: string) => {
  return HTML_TAG_REGEX.test(content);
};
