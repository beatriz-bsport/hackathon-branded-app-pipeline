export function mapFormData(base, map) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(base)) {
    if (!(typeof map[key] === 'boolean') && !map[key]) {
      throw new Error(`Mapping for key ${key} does not exist.`);
    }

    if (value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(map[key], JSON.stringify(value));
      } else {
        formData.append(map[key], value);
      }
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

export function mapFormDataWithObject(base, map, keyExecptionsList) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    const isVariantKey = key.includes('variants.');
    const isFranchiseCompanyKey = key.includes('company_ids');
    // Retail variant creation
    if (isVariantKey || isFranchiseCompanyKey) {
      formData.append(key, value);
    }
    if (
      !isVariantKey &&
      !isFranchiseCompanyKey &&
      !(typeof map[key] === 'boolean') &&
      !map[key]
    ) {
      throw new Error(`Mapping for key ${key} does not exist.`);
    }
    if (!isVariantKey && !isFranchiseCompanyKey && value !== undefined) {
      if (Array.isArray(value)) {
        formData.append(map[key], JSON.stringify(value));
      } else if (key === 'bookkeeping_account' && value === null) {
        formData.append(map[key], '');
      } else if (
        typeof value === 'object' &&
        !keyExecptionsList.includes(key)
      ) {
        formData.append(map[key], JSON.stringify(value));
      } else {
        formData.append(map[key], value);
      }
    }
  }
  return formData;
}

export default { mapFormData, mapFormDataWithObject, unmap };
