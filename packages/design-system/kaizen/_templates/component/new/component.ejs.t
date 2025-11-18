---
to: src/components/<%= h.inflection.camelize(name, false) %>/<%= h.inflection.camelize(name, false) %>.tsx
---
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const defaultClasses = [] as const

const variants = {} as const

const <%= h.inflection.camelize(name, true) %> = cva(defaultClasses, {
  variants,
})

export type <%= h.inflection.camelize(name, false) %>Props = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof <%= h.inflection.camelize(name, true) %>>

const <%= h.inflection.camelize(name, false) %>: React.FC< <%= h.inflection.camelize(name, false) %>Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={<%= h.inflection.camelize(name, true) %>({ className })} {...props}>Component <%= h.inflection.camelize(name, true) %></div>
  )
}

<%= h.inflection.camelize(name, false) %>.displayName = "Kaizen<%= h.inflection.camelize(name, false) %>";

export default <%= h.inflection.camelize(name, false) %>;
