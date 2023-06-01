import React, { useCallback, useState, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'recompose';
import { Collapse, Typography } from '@material-ui/core';
// import the editor component
import Editor from 'react-simple-code-editor';
// prism is a syntax hilighter + styling for code
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-css';
// import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/themes/prism-dark.css';

// TODO : This is probably breaking the UX and disable the possibility to scroll on both side independently.
// import withPageHeightHOC,  {WithPageHeight} from '#hocs/with-page-height.hoc';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import { interpolateCSSVar } from '#libs/widget/utils';

type Props = {
  code: string;
  baseCss: string;
  showBaseCode: boolean;
  onCodeChange: (value: string) => void;
  // TODO : Probably fix this.
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
          value={interpolateCSSVar(baseCss, DOMLoaded)}
          onValueChange={null}
          highlight={doHighlight}
          padding={10}
          disabled
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            backgroundColor: 'rgb(39, 40, 34)',
            color: '#fff',
            marginBottom: 24,
          }}
        />
        <Typography variant="h6">{t('widget.customCss.yourCode')}</Typography>
      </Collapse>
      <Editor
        value={code}
        onValueChange={onCodeChange}
        highlight={doHighlight}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          backgroundColor: 'rgb(39, 40, 34)',
          color: '#fff',
          minHeight: pageHeight,
        }}
      />
    </div>
  );
};

export default compose<any, Props>(
  // withPageHeightHOC()
  React.memo,
  marketplaceCssHoc(),
)(CssCodeTextarea);
