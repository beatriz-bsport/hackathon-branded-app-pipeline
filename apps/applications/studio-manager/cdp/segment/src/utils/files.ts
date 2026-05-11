export function createFileUrl(file: File | Blob | null) {
  if (!file) {
    return null;
  }

  try {
    return (window.URL || window.webkitURL).createObjectURL(file);
  } catch (err) {
    // Expected TypeError:
    // TypeError: Failed to execute 'createObjectURL' on 'URL': Overload resolution failed.
    if (err instanceof TypeError) {
      console.error(err);
      return null;
    } else {
      throw err; // For others errors
    }
  }
}
