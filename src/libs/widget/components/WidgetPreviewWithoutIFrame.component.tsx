import React, { useCallback, useEffect, useState } from 'react';

import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Config from '../../../config';
import { WidgetCustomCSS } from '#libs/theme/types';
import WidgetApplyCustomTheme from './WidgetApplyCustomTheme.component';

type Props = {
  company: number;
  franchise: number;
  componentType: string;
  config: any;
  dialogMode: 0 | 1 | 2;
  language?: string;
  showFab: boolean;
  uuid?: string | null;
  fullScreenPopup: boolean;
  styles: WidgetCustomCSS;
};

export const WidgetPreviewWithoutIFrame: React.FC<Props> = ({
  company,
  config,
  franchise,
  componentType,
  dialogMode,
  language,
  showFab,
  uuid,
  fullScreenPopup,
  styles,
}) => {
  const classes = useStyles();

  const [divRef, setRef] = useState(null);
  const [, setLoading] = useState(true);

  const onLoad = useCallback(() => {
    if (window.BsportWidget) {
      window.BsportWidget.mount({
        parentElement: `bsport-widget${uuid || ''}`,
        companyId: company,
        franchiseId: franchise,
        dialogMode,
        widgetType: componentType,
        ...(language !== 'none' ? { language } : {}),
        showFab,
        fullScreenPopup,
        config: {
          [componentType]: config[componentType],
        },
      });
      setLoading(false);
    }
  }, [
    company,
    componentType,
    dialogMode,
    franchise,
    fullScreenPopup,
    language,
    showFab,
    uuid,
    config,
  ]);

  useEffect(() => {
    let url = `https://${Config.REACT_APP_CDN_DOMAIN}`;

    if (url.includes('localhost')) {
      url = `http://${Config.REACT_APP_CDN_DOMAIN}/widget.js`;
    } else {
      url += '/scripts/widget.js';
    }

    let script = document.getElementById('bsport-widget-cdn');
    if (script) {
      onLoad();
      return () => {
        script.removeEventListener('load', onLoad);
      };
    }
    script = document.createElement('script');
    script.id = 'bsport-widget-cdn';
    script.src = url;
    document.body.appendChild(script);
    script.addEventListener('load', onLoad);

    return () => {
      if (script) {
        script.removeEventListener('load', onLoad);
      }
    };
  }, [onLoad]);

  return (
    <>
      <div ref={setRef} id={`bsport-widget${uuid || ''}`} />
      {divRef?.children?.length === 0 && (
        <div className={classes.center}>
          <CircularProgress />
        </div>
      )}
      <WidgetApplyCustomTheme styles={styles} />
    </>
  );
};

const useStyles = makeStyles(() => ({
  previewErrorContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iframe: {
    display: 'flex',
    flex: 1,
    height: '100%',
    borderStyle: 'none',
  },

  center: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around',
  },
}));

export default WidgetPreviewWithoutIFrame;
