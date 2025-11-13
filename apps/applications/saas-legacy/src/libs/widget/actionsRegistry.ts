import { CallAction, WidgetApiMessageType } from './types';

type Registry<T> = Record<WidgetApiMessageType, T>;

export class BridgeAPIActionsRegistry<T> {
  #_registry: Partial<Registry<T>> = {};

  #_client: 'widget' | 'SaaS';

  constructor(client: 'widget' | 'SaaS') {
    this.#_client = client;
  }

  // Method to add an entry to the registry
  add(key: WidgetApiMessageType, value: T): void {
    if (this.has(key)) {
      console.warn(`Key ${key} is already bound to a ${this.#_client} action`);
    }
    this.#_registry[key] = value;
  }

  // Method to retrieve an entry from the registry
  get(key: WidgetApiMessageType): T | undefined {
    if (!this.has(key)) {
      throw new Error(`Key ${key} is not bound to any ${this.#_client} action`);
    }
    return this.#_registry[key];
  }

  // Method to check if a key exists in the registry
  has(key: WidgetApiMessageType): boolean {
    return key in this.#_registry;
  }

  // Method to remove an entry from the registry
  remove(key: WidgetApiMessageType): void {
    delete this.#_registry[key];
  }

  // Method to get all entries in the registry
  getAll() {
    return { ...this.#_registry };
  }

  // Decorator to add items to the registry
  register(key: WidgetApiMessageType, value: T) {
    this.add(key, value);
  }
}

/**
 * Registry to store all the actions that are bound to the bridge API
 * @method add - Method to add an entry to the registry
 * @method get - Method to retrieve an entry from the registry
 * @method has - Method to check if a key exists in the registry
 * @method remove - Method to remove an entry from the registry
 * @method getAll - Method to get all entries in the registry
 * @method register - Decorator to add items to the registry
 */

export const bridgeAPIActionsRegistry = new BridgeAPIActionsRegistry<
  CallAction<any, any>
>('SaaS');
