import React from 'react';

export abstract class ElementDOMController<ComponentProps> {
  ComponentClass: React.ComponentType;

  id: string;

  elm: Element | null;

  compatibleWithResize = false;

  select(id: string) {
    this.elm = document.getElementById(id);
    this.id = id;
    return this;
  }

  abstract getProps: () => ComponentProps;

  abstract getPosition: () => { x: number; y: number };

  abstract setPosition: (x: number, y: number) => void;

  abstract focus: () => void;

  abstract blur: () => void;
}
