/* eslint-disable-next-line */
const ButtonHTMLTypes = ['submit', 'button', 'reset'] as const;
export type ButtonHTMLType = (typeof ButtonHTMLTypes)[number];
