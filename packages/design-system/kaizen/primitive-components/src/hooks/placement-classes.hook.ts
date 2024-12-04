import { useMemo } from "react";

export const Placements = [
  "top",
  "top-left",
  "top-right",
  "bottom",
  "bottom-left",
  "bottom-right",
  "left",
  "right",
] as const;

const placementClasses = {
  top: ["bottom-full", "left-1/2", "-translate-x-1/2", "-translate-y-[5px]"],
  "top-left": ["bottom-full", "left-[0]", "-translate-y-[5px]"],
  "top-right": ["bottom-full", "right-[0]", "-translate-y-[5px]"],
  bottom: ["top-full", "left-1/2", "-translate-x-1/2", "translate-y-[5px]"],
  "bottom-left": ["top-full", "left-[0]", "translate-y-[5px]"],
  "bottom-right": ["top-full", "right-[0]", "translate-y-[5px]"],
  left: ["right-full", "top-1/2", "-translate-y-1/2", "-translate-x-[5px]"],
  right: ["left-full", "top-1/2", "-translate-y-1/2", "translate-x-[5px]"],
};

const usePlacementClasses = (placement: (typeof Placements)[number]) => {
  return useMemo(
    () => ["absolute", ...placementClasses[placement]],
    [placement],
  );
};

export default usePlacementClasses;
