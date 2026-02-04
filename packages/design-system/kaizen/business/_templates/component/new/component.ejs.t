---
to: src/components/<%= name %>/<%= h.inflection.camelize(name.split('/').pop(), false) %>.tsx
---
<%
const componentName = name.split('/').pop();
const ComponentName = h.inflection.camelize(componentName, false);
const componentNamePascal = h.inflection.camelize(componentName, true);
-%>
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const defaultClasses = [] as const;

const variants = {} as const;

const <%= componentNamePascal %> = cva(defaultClasses, {
  variants,
});

export type <%= ComponentName %>Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof <%= componentNamePascal %>>;

const <%= ComponentName %>: React.FC< <%= ComponentName %>Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={<%= componentNamePascal %>({ className })} {...props}>Component <%= componentNamePascal %></div>
  )
};

<%= ComponentName %>.displayName = "Kaizen<%= ComponentName %>";

export default <%= ComponentName %>;

