---
to: src/components/<%= h.inflection.camelize(name, false) %>/index.ts
---
export type { <%= h.inflection.camelize(name, false) %>Props } from "./<%= h.inflection.camelize(name, false) %>";
export { default } from "./<%= h.inflection.camelize(name, false) %>";
