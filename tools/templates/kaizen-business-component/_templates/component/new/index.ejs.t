---
to: src/components/<%= name %>/index.ts
---
<%
const componentName = name.split('/').pop();
const ComponentName = h.inflection.camelize(componentName, false);
-%>
export type { <%= ComponentName %>Props } from "./<%= ComponentName %>";
export { default } from "./<%= ComponentName %>";

