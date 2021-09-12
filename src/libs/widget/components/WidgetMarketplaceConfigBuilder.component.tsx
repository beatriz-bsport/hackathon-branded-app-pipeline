import React from 'react';
import { compose } from 'recompose';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { withTranslation, WithTranslation } from 'react-i18next';
import { withStyles, Theme } from '@material-ui/core/styles';
import { MaterialStyleType } from '../../../utils/types';

import { fromConfigToUrl } from '../../marketplace/routing-utils';
import Config from '../../../config';
import { Theme as CompanyTheme } from '../../theme/types';

type OwnProps = {
  config: any;
  componentType: string;
  theme: CompanyTheme;
  copyToClipboard: (str: string) => void;
  error: Error | null;
  classes: any;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export class WidgetMarketplaceConfigBuilder extends React.Component<Props> {
  getUrl = () => {
    let url = '';

    const urlParams = fromConfigToUrl({
      component_type: this.props.componentType,
      config: this.props.config,
    });
    if (!urlParams || urlParams === '/') {
      return '';
    }

    url = `${Config.PUBLIC_URL}/m/${this.props.theme.company_name}/${this.props.theme.company}/${urlParams}`;
    return url;
  };

  render() {
    const url = this.getUrl();
    if (!url) {
      return null;
    }
    const { t, error, copyToClipboard, classes } = this.props;
    return (
      <div>
        <Typography className={classes.marginTop}>
          {t('widget.linkToConfig')}
        </Typography>

        <Paper elevation={1} className={classes.codeContainer}>
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.code}
          >
            {error ? t('widget.widgetPreviewError') : url}
          </Typography>

          {!error && (
            <ButtonBase
              onClick={() => copyToClipboard(url)}
              className={classes.copyClipboardContainer}
            >
              <FileCopyIcon />
            </ButtonBase>
          )}
        </Paper>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  marginTop: {
    marginTop: theme.spacing(2),
  },
  codeContainer: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    position: 'relative',
  },
  code: {
    whiteSpace: 'pre-wrap',
    paddingRight: theme.spacing(4),
  },
  copyClipboardContainer: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['widget']),
  // @ts-ignore
  withStyles(styles),
)(WidgetMarketplaceConfigBuilder);
