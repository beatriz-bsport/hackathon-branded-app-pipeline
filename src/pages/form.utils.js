export function mapFormData(base, map) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    if (!map[key]) {
      throw new Error(`Mapping for key ${key} does not exist.`);
    }
    formData.append(map[key], value);
  }
  return formData;
}
