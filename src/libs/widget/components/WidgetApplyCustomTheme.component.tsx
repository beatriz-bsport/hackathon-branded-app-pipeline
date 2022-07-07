import React from 'react';
import { pure } from 'recompose';

import { WidgetCustomCSS } from '#libs/theme/types';
import { getCustomWidgetStyle } from '../utils';

type Props = {
  styles: WidgetCustomCSS;
};

export const WidgetApplyCustomTheme: React.FC<Props> = ({ styles = {} }) => {
  const customStyle = getCustomWidgetStyle(styles);

  return (
    <style>
      {`
      #bs-setup-derived-variable {
        ${customStyle.id}
      }

      .bs-setup-variable { ${customStyle.classes} } 
      `}
    </style>
  );
};

export default pure(WidgetApplyCustomTheme);
