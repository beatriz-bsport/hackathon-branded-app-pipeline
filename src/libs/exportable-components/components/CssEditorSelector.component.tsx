import React, { useLayoutEffect, useState, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import WidgetsIcon from '@material-ui/icons/Widgets';
import ReplayIcon from '@material-ui/icons/Replay';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Typography } from '@material-ui/core';
import { TFunction } from 'i18next';
// @ts-expect-error
import withConfirm from '#hocs/with-confirm.hoc';
import DoubleIndicatorSelector from '#components/Selector/DoubleIndicatorSelector.component';
import HoverableInfo from '#components/HoverableInfo.component';
import { CSS_COMPONENT_PAGES } from '#libs/exportable-components/custom_css_variants';
import { MarketplaceCSSComponentConfig, MarketplacePage } from '../types';
import { getCssComponentsForPage } from '../utils';

const COMPONENTS_BY_PAGE = CSS_COMPONENT_PAGES.reduce<
  Record<string, MarketplaceCSSComponentConfig[]>
>((acc, page) => {
  acc[page] = getCssComponentsForPage(page);
  return acc;
}, {});

type Props = {
  resetAll: () => void;
  onSelect: (page: MarketplacePage, componentId: string) => void;
  page: MarketplacePage;
  componentId: string;
};

const CssEditorSelector: React.FC<Props> = ({
  resetAll,
  onSelect,
  page,
  componentId,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('widget');

  const [, setLayoutLoaded] = useState(false);

  // reload on layout at first render as we pass by dom element to
  // compute the style
  useLayoutEffect(() => {
    setLayoutLoaded(true);
  }, []);

  const componentOptions = useMemo(
    () =>
      Array.from(COMPONENTS_BY_PAGE?.[page] || []).map((component) => ({
        label: t(`widget.components.${component.label}`),
        value: component.label,
      })),
    [page, t],
  );

  const pageOptions = useMemo(
    () =>
      Array.from(CSS_COMPONENT_PAGES).map((_page) => ({
        value: _page,
        label: t(`widget.page.${_page}`),
      })),
    [t],
  );

  const handleSelectPage = useCallback(
    (opt: { value: MarketplacePage }) => {
      const newComponent = COMPONENTS_BY_PAGE[opt.value]?.[0]?.label;
      onSelect(opt.value, newComponent);
    },
    [onSelect],
  );

  const handleSelectComponent = useCallback(
    (opt: { value: string }) => {
      onSelect(page, opt.value);
    },
    [onSelect, page],
  );

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="h6">
        <WidgetsIcon className={classes.icon} />
        {t('widget.customCss.element')}
        <HoverableInfo text={t('widget.customCss.info')} />
      </Typography>
      <div className={classes.selectors}>
        <div className={classes.innerContainer}>
          <Typography className={classes.subtitle}>
            {t('widget.customCss.choiceWidget')}
          </Typography>
          <DoubleIndicatorSelector
            isMulti={false}
            onChange={handleSelectPage}
            options={pageOptions}
            value={pageOptions.find((opt) => opt.value === page)}
          />
        </div>

        <div className={classes.innerContainer}>
          <Typography className={classes.subtitle}>
            {t('widget.customCss.choiceElement')}
          </Typography>

          <DoubleIndicatorSelector
            isMulti={false}
            onChange={handleSelectComponent}
            options={componentOptions}
            value={componentOptions.find((opt) => opt.value === componentId)}
          />
        </div>
        <div className={classes.innerContainer} />
      </div>
      <ButtonResetAll onClick={resetAll} />
    </div>
  );
};

const ButtonResetAll = withConfirm(
  ({ onClick }: { onClick: () => void }) => {
    const { t } = useTranslation(['widget']);
    const classes = useStyles();

    return (
      <ButtonBase className={classes.buttonReset} onClick={onClick}>
        <ReplayIcon className={classes.icon} />
        <Typography className={classes.upperCase} color="textSecondary">
          {t('widget.cssEditor.reset')}
        </Typography>
      </ButtonBase>
    );
  },
  'onClick',
  {
    title: 'widget:widget.cssEditor.dialog.title',
    cancel: 'widget:widget.cssEditor.dialog.cancel',
    confirm: 'widget:widget.cssEditor.dialog.confirm',
    Content: ({ t }: { t: TFunction }) => (
      <p>{t('widget:widget.cssEditor.dialog.content')}</p>
    ),
    isDeletion: true,
    countDownConfirm: true,
  },
);

const useStyles = makeStyles((theme) => ({
  icon: {
    fill: theme.palette.grey[600],
  },
  title: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  buttonReset: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    position: 'absolute',
    borderRadius: 5,
    top: 0,
    right: 0,
  },
  selectors: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: theme.spacing(2),
  },
  upperCase: {
    textTransform: 'uppercase',
  },
  container: {
    position: 'relative',
  },
  subtitle: {
    marginBottom: theme.spacing(2),
  },
  innerContainer: {
    flex: 1,
  },
}));

export default React.memo(CssEditorSelector);
