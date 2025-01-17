import React, { useCallback, useState, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Collapse, Typography } from '@material-ui/core';
import Editor from 'react-simple-code-editor';
// @ts-expect-error

import { highlight, languages } from 'prismjs/components/prism-core';

import 'prismjs/components/prism-css';

import 'prismjs/themes/prism-dark.css';

import { interpolateCSSVar } from '#src/libs/widget/utils';

type Props = {
  code: string;
  baseCss: string;
  showBaseCode: boolean;
  onCodeChange: (value: string) => void;
  pageHeight?: number;
};

const CssCodeTextarea: React.FC<Props> = ({
  code,
  onCodeChange,
  pageHeight,
  baseCss,
  showBaseCode,
}) => {
  const { t } = useTranslation('widget');
  const [DOMLoaded, setDOMLoaded] = useState(false);

  useLayoutEffect(() => {
    setDOMLoaded(true);
  }, []);

  const doHighlight = useCallback(
    (codeToHilight: string) => highlight(codeToHilight, languages.css),
    [],
  );

  return (
    <div
      style={{
        height: pageHeight,
        overflow: 'auto',
      }}
    >
      <Collapse in={showBaseCode}>
        <Typography variant="h6">{t('widget.customCss.baseCode')}</Typography>
        <Editor
          disabled
          highlight={doHighlight}
          onValueChange={null}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            backgroundColor: 'rgb(39, 40, 34)',
            color: '#fff',
            marginBottom: 24,
          }}
          value={interpolateCSSVar(baseCss, DOMLoaded)}
        />
        <Typography variant="h6">{t('widget.customCss.yourCode')}</Typography>
      </Collapse>
      <Editor
        highlight={doHighlight}
        onValueChange={onCodeChange}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          backgroundColor: 'rgb(39, 40, 34)',
          color: '#fff',
          minHeight: pageHeight,
        }}
        value={code}
      />
    </div>
  );
};

export default React.memo(CssCodeTextarea);
