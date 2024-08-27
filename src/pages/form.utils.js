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

/**
 * Returns a Form Data instance from an object.
 * Keys can be ignored with keyExceptionList param.
 * @param base The source object
 * @param map An object that maps final key names from source object
 * @param keyExceptionList Any key that is in this array will be skipped and not within FormData instance
 * @returns {FormData}
 */
export function mapFormDataWithObject(base, map, keyExceptionList) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(base)) {
    const isVariantKey = key.includes('variants.');
    const isFranchiseCompanyKey = key.includes('company_ids');
    // Retail variant creation
    if (isVariantKey || isFranchiseCompanyKey) {
      formData.append(key, value);
    }
    // directly skip a key if its in the key exception list
    if (keyExceptionList?.includes(key)) {
      continue;
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
      } else if (typeof value === 'object' && !keyExceptionList.includes(key)) {
        formData.append(map[key], JSON.stringify(value));
      } else {
        formData.append(map[key], value);
      }
    }
  }
  return formData;
}

export default { mapFormData, mapFormDataWithObject, unmap };
