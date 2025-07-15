import type { Item, MenuOption } from "@bsport/kaizen-primitive-core";

export function isMenuOption(item: Item): item is MenuOption {
  return "rightSlot" in item;
}
