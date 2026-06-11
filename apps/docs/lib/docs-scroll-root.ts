export const DOCS_MAIN_SCROLL_SELECTOR = "[data-docs-main-scroll]";

export function getDocsMainScrollRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>(DOCS_MAIN_SCROLL_SELECTOR);
}

export function getDocsScrollObserverRootMargin(): string {
  const article = document.querySelector("[data-has-page-tabs]");
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-page-tabs-height")
    .trim();
  const tabsHeight = Number.parseFloat(raw);
  const topOffset =
    article && Number.isFinite(tabsHeight) ? tabsHeight + 16 : 16;
  return `-${topOffset}px 0px -65% 0px`;
}

export function getDocsScrollObserverOptions(): IntersectionObserverInit {
  return {
    root: getDocsMainScrollRoot(),
    rootMargin: getDocsScrollObserverRootMargin(),
    threshold: [0, 1],
  };
}
