import React from 'react';

import {
  AnnotationInfo,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from '#src/components/untitledui';

import { ModalDialogColorEnum } from './constants';
import { ModalDialogColor } from './types';

/**
 * Retrieve the fallback icon associated to the current dialog color
 * @param color The dialog color theme
 */
export const useModalDialogDefaultLeftIcon = (color: ModalDialogColor) => {
  switch (color) {
    case ModalDialogColorEnum.INFO:
      return <AnnotationInfo stroke="currentColor" />;
    case ModalDialogColorEnum.SUCCESS:
      return <CheckCircle stroke="currentColor" />;
    case ModalDialogColorEnum.WARNING:
      return <AlertTriangle stroke="currentColor" />;
    case ModalDialogColorEnum.ERROR:
      return <AlertCircle stroke="currentColor" />;
    default:
      return null;
  }
};
