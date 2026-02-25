import tinyinvariant from "tiny-invariant";

export const invariant: typeof tinyinvariant = (condition, message) => {
  const isLocal = import.meta.env.DEV;

  if (isLocal) {
    tinyinvariant(condition, message);
    return;
  }
};
