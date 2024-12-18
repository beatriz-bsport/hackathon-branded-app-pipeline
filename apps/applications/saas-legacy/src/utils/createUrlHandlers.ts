export function createUrl(file: File | Blob | null) {
  let previewURL;

  try {
    previewURL = (window.URL || window.webkitURL).createObjectURL(file);
  } catch (err) {
    // Expected TypeError:
    // TypeError: Failed to execute 'createObjectURL' on 'URL': Overload resolution failed.
    if (err instanceof TypeError) {
      console.error(err);
    } else {
      throw err; // for others errors
    }
  }

  return previewURL;
}

export const cleanParams = (params: { [key: string]: any }) => {
  // Returns the same dictionary, without the keys whose values are null or undefined
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value != null && value !== undefined,
    ),
  );
};
