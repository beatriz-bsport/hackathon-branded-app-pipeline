import generatedProps from "#src/lib/generated/props.json";

export type PropDef = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
};

export type PropsByComponent = Record<string, PropDef[]>;

const allProps = generatedProps as PropsByComponent;

export function getAllProps(): PropsByComponent {
  return allProps;
}

export function getProps(component: string): PropDef[] | null {
  return allProps[component] ?? null;
}
