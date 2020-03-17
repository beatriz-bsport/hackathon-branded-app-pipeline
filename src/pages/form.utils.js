export function mapFormData(base, map) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    if (!(typeof map[key] === 'boolean') && !map[key]) {
      throw new Error(`Mapping for key ${key} does not exist.`);
    }
    if (value !== undefined) {
      formData.append(map[key], value);
    }
  }
  return formData;
}

function resolve(ob, path) {
  return path.reduce((o, attr) => o && o[attr], ob);
}

export function unmap(ob, map) {
  const newOb = {};
  Object.keys(map).forEach((k) => {
    const path = `${map[k]}`.split('.');
    newOb[k] = resolve(ob, path) || (ob && ob[k]);
  });
  return newOb;
}

export default { mapFormData, unmap };
