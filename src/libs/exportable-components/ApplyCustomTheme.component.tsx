import React from 'react';

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

export default React.memo(ApplyCustomTheme);
