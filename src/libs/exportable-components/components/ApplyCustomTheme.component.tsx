/*
TODO REMOVE THE DUPLICATE FILE : src/libs/widget/components/WidgetApplyCustomTheme.component.tsx
Not done yet since it will break widget build.
*/
import React from 'react';
import { pure } from 'recompose';

import { WidgetCustomCSS } from '#libs/theme/types';
import { getCustomWidgetStyle } from '#libs/widget/utils';

type Props = {
  styles: WidgetCustomCSS;
};

export const ApplyCustomTheme: React.FC<Props> = ({ styles = {} }) => {
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

export default pure(ApplyCustomTheme);
