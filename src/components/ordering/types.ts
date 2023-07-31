import { DraggableSyntheticListeners } from '@dnd-kit/core';
import React from 'react';

export interface Category {
  id: number;
  name: string;
  company: number;
  category_ordering: number;
}

export interface CategoryWithItems extends Category {
  items: Array<any>;
}

export interface ListItem {
  (
    item: any,
    onEdit: () => void,
    onClick: () => void,
    onDelete: () => void,
    onDuplicate?: () => void,
    selected?: boolean,
    draggable?: boolean,
    listeners?: DraggableSyntheticListeners,
    attributes?: {
      role: string;
      tabIndex: number;
      'aria-pressed': boolean;
      'aria-roledescription': string;
      'aria-describedby': string;
    },
  ): React.ReactElement;
}
