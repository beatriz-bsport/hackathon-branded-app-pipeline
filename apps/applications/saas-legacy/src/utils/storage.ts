type StorageType = 'local' | 'session';

function getStorageType(type: StorageType): Storage {
  return type === 'local' ? window.localStorage : window.sessionStorage;
}

function setItemInStorage(type: StorageType, key: string, value: string): void {
  try {
    const storage = getStorageType(type);
    storage.setItem(key, value);
  } catch (error) {
    console.error(`Error setting item to ${type}Storage:`, error);
  }
}

function getItemInStorage(type: StorageType, key: string): string | null {
  try {
    const storage = getStorageType(type);
    return storage.getItem(key) || null;
  } catch (error) {
    console.error(`Error getting item from ${type}Storage:`, error);
    return null;
  }
}

function removeItemInStorage(type: StorageType, key: string): void {
  try {
    const storage = getStorageType(type);
    storage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item from ${type}Storage:`, error);
  }
}

function clearStorage(type: StorageType): void {
  try {
    const storage = getStorageType(type);
    storage.clear();
  } catch (error) {
    console.error(`Error clearing ${type}Storage:`, error);
  }
}

function storageToString(type: StorageType): string {
  try {
    const storageObject: { [key: string]: string | null } = {};
    const storage = getStorageType(type);

    for (let i = 0; i < storage.length; i++) {
      let key = storage.key(i);
      if (key !== null) {
        storageObject[key] = storage.getItem(key);
      }
    }

    return JSON.stringify(storageObject);
  } catch (error) {
    console.error(`Error clearing ${type}Storage:`, error);
    return '';
  }
}

function stringToStorage(
  type: StorageType,
  stringifiedSessionStorage: string,
): void {
  try {
    let sessionStorageObject = JSON.parse(stringifiedSessionStorage);

    for (let key in sessionStorageObject) {
      setItemInStorage(type, key, sessionStorageObject[key]);
    }
  } catch (error) {
    console.error(`Error clearing ${type}Storage:`, error);
  }
}

export {
  setItemInStorage,
  getItemInStorage,
  removeItemInStorage,
  clearStorage,
  storageToString,
  stringToStorage,
};
